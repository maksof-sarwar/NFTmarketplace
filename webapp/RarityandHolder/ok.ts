import { prisma } from '@marketplace/db';
import { RateLimit } from 'async-sema';
import { ethers } from 'ethers';
import axios from 'axios'
const erc721ABI = require('./erc721_abi.json')
import { Metadata, MetadataMap } from './type';
import { getAllTraits } from '@marketplace/api/getAllTraits';
import { SocketHandler } from '@marketplace/socket/server';
const rateLimit = RateLimit(0.3)
const provider = new ethers.providers.JsonRpcProvider(
  'https://test-rpc.vitruveo.xyz'
);



function withImageURL(metadata: Metadata) {
  const adjustedMetadata = { ...metadata };
  if (
    adjustedMetadata.image &&
    adjustedMetadata.image.startsWith('ipfs://')
  ) {
    const ipfsHash = adjustedMetadata.image.replace('ipfs://', '');
    const ipfsGatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
    adjustedMetadata.image = ipfsGatewayUrl;
  }
  return adjustedMetadata;
}
async function fetchTokenMetadata(tokenURI: string) {
  await rateLimit()
  let url = tokenURI;
  try {
    if (tokenURI.startsWith('ipfs://')) {
      const ipfsHash = tokenURI.replace('ipfs://', '');
      url = `https://ipfs.io/ipfs/${ipfsHash}`;
    }

    const metadataResponse = await axios.get(url);
    const json = metadataResponse.data as Metadata;

    return withImageURL(json)
  } catch (err) {
    // for accuracy remove comment

    return null
  }
}

function calculateScoresForTraitTypes(metadataMap: MetadataMap) {
  const traitScores: any = {};
  const traitCounts: any = {}; // Object to store count of each trait_type occurrence

  // Count occurrences of each trait_type across all metadata
  for (const tokenId in metadataMap) {
    const metadata = metadataMap[tokenId];
    if (!metadata.attributes) {
      continue; // Skip if attributes are not defined
    }
    metadata.attributes?.forEach((attribute: any) => {
      const traitType = attribute.trait_type;
      traitCounts[traitType] = traitCounts[traitType]
        ? traitCounts[traitType] + 1
        : 1; // Increment count of trait_type occurrence
    });
  }

  // Normalize scores inversely proportional to traitCount
  const totalTokens = Object.keys(metadataMap).length;
  for (const tokenId in metadataMap) {
    const metadata = metadataMap[tokenId];
    if (!metadata.attributes) {
      continue; // Skip if attributes are not defined
    }
    metadata.attributes?.forEach((attribute: any) => {
      const traitType = attribute.trait_type;
      const traitCount = traitCounts[traitType];
      // Inverse normalization: 1 - (traitCount / totalTokens)
      traitScores[traitType] = traitScores[traitType] || 0;
      traitScores[traitType] += (1 - traitCount / (totalTokens + 1)) * 100;
    });
  }

  return { traitScores, traitCounts };
}
function updateMetadataWithScores(metadataMap: MetadataMap, traitScores: any, traitCounts: any) {
  for (const tokenId in metadataMap) {
    const metadata = metadataMap[tokenId];
    if (!metadata.attributes) {
      console.error(`Attributes not defined for token ${tokenId}`);
      continue; // Skip if attributes are not defined
    }
    metadata.attributes?.forEach((attribute: any) => {
      const traitType = attribute.trait_type;
      attribute.score = traitScores[traitType];
      attribute.traitCount = traitCounts[traitType] || 0; // Add trait count to each attribute
    });

    // Remove "traits" field if it exists
    delete metadata.traits;
  }

  return metadataMap
}
function calculateTotalRarityScore(metadata: Metadata) {
  let totalScore = 0;
  if (!metadata.attributes) {
    console.error('Attributes not defined for token metadata');
    return totalScore; // Return 0 if attributes are not defined
  }
  metadata.attributes?.forEach((attribute: any) => {
    totalScore += attribute.score || 0; // Add the score of each attribute
  });
  return totalScore;
}
function calculateRarityFromMetadata(metadataMap: MetadataMap) {
  const rarityScores: any = {};
  for (const tokenId in metadataMap) {
    const metadata = metadataMap[tokenId];
    const totalRarityScore = calculateTotalRarityScore(metadata);
    rarityScores[tokenId] = totalRarityScore;
  }
  return rarityScores;
}

function rankTokens(rarityScores: any) {
  const rankedTokens = [];

  // Sort tokens by rarity score in descending order
  const sortedTokens = Object.entries(rarityScores).sort((a: any, b: any) => b[1] - a[1]);

  let rank = 1;
  let prevScore = null; // Track previous score to handle ties
  let scoreCount = 0; // Counter to keep track of tokens with the same score
  for (const [tokenId, score] of sortedTokens) {
    // If score is different from previous score, update rank
    if (score !== prevScore) {
      prevScore = score;
      rank += scoreCount; // Update rank
      scoreCount = 1; // Reset score count for the next iteration
    } else {
      scoreCount++; // Increment score count in case of tie
    }
    rankedTokens.push({ tokenId, totalRarityScore: score, rank });
  }

  return rankedTokens;
}

export const fetchTokens = async (contractAddress: string) => {
  const contract = new ethers.Contract(contractAddress, erc721ABI, provider);
  const collection = await prisma.collection.findUnique({ where: { address: contractAddress } })

  if (!collection) {
    return undefined;
  }

  const fetchedTotalSupply = await contract.totalSupply();
  const totalSupply = fetchedTotalSupply.toNumber();
  console.log(`found totalSupply :`, totalSupply);
  const tokensURI = await Promise.all(
    Array.from({ length: totalSupply })
      .map<{ uri: string; tokenId: string }>((_, tokenId) => {
        console.log('tokenId', tokenId);
        return contract.tokenURI(tokenId).then((uri: string) => ({ uri, tokenId }))
      })
  );

  const tokensMetadata = await Promise.allSettled(
    tokensURI.map(({ tokenId, uri }) => {
      return fetchTokenMetadata(uri)
        .then(data => ({ tokenId, data }))
    })
  )
  console.log(`total tokensMetadata:`, Object.keys(tokensMetadata).length);
  let metadataMap: Record<string, Metadata> = {}
  for (const token of tokensMetadata) {
    if (token.status === 'fulfilled') {

      const value = token.value
      const attr = value.data.attributes
      if (attr && typeof attr === 'object' && !Array.isArray(attr)) {
        value.data.attributes = Object.entries(attr).map(([key, value]) => ({ value, trait_type: key }))
      }
      if (!attr) {
        value.data.attributes = []
      }
      metadataMap[value.tokenId] = { id: value.tokenId.toString(), ...value.data }
    } else {
      console.log(token.reason);
    }
  }

  const { traitScores, traitCounts } = calculateScoresForTraitTypes(metadataMap);
  metadataMap = updateMetadataWithScores(metadataMap, traitScores, traitCounts)
  const rarityScores = calculateRarityFromMetadata(metadataMap);
  const rankedTokens = rankTokens(rarityScores);
  for (const token of rankedTokens) {
    const tokenId = token.tokenId;
    const rarityData = {
      totalRarityScore: token.totalRarityScore,
      rank: token.rank,
    };
    metadataMap[tokenId].rarity = rarityData;
  }

  const traits = getAllTraits(Object.values(metadataMap))
  return { metadataMap, collection, traits }

}