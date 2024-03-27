const fs = require('fs');

// Load the ABI of your ERC-721 contract
const erc721ABI = JSON.parse(fs.readFileSync('erc721_abi.json', 'utf8'));

// Initialize ethers provider
const { ethers } = require('ethers');
const provider = new ethers.providers.JsonRpcProvider(
	'https://test-rpc.vitruveo.xyz'
);

// Instantiate the ERC-721 contract
const contractAddress = '0x7C7FBB934FB96b2355DcA0e14Ad178DF24a6461f';
const contract = new ethers.Contract(contractAddress, erc721ABI, provider);

// Object to store fetched metadata
const metadataMap = {};

// Function to fetch token metadata from HTTP or IPFS
async function fetchTokenMetadata(tokenId) {
	try {
		const tokenUri = await contract.tokenURI(tokenId);
		if (!tokenUri) {
			console.error(`Token URI not found for token ${tokenId}`);
			return null;
		}
		if (tokenUri.startsWith('ipfs://')) {
			// If token URI is in IPFS format
			const ipfsHash = tokenUri.replace('ipfs://', '');
			const ipfsGatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
			const metadataResponse = await fetch(ipfsGatewayUrl);
			const metadata = await metadataResponse.json();
			console.log(`Successfully fetched metadata for token ${tokenId}`);
			metadataMap[tokenId] = metadata; // Store metadata in the map
			return metadata;
		} else {
			// If token URI is a regular HTTP URL
			const metadataResponse = await fetch(tokenUri);
			const metadata = await metadataResponse.json();
			console.log(`Successfully fetched metadata for token ${tokenId}`);
			metadataMap[tokenId] = metadata; // Store metadata in the map
			return metadata;
		}
	} catch (error) {
		console.error(
			`Error fetching metadata for token ${tokenId}:`,
			error.message
		);
		return null;
	}
}

// Function to adjust image URL in metadata if it starts with ipfs://
async function adjustImageURL(metadata) {
	try {
		const adjustedMetadata = { ...metadata }; // Create a copy of the metadata object
		if (
			adjustedMetadata.image &&
			adjustedMetadata.image.startsWith('ipfs://')
		) {
			// If image URL starts with ipfs://, replace it with IPFS gateway URL
			const ipfsHash = adjustedMetadata.image.replace('ipfs://', '');
			const ipfsGatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
			adjustedMetadata.image = ipfsGatewayUrl;
		}
		return adjustedMetadata;
	} catch (error) {
		throw error; // Propagate the error to the caller
	}
}

function calculateScoresForTraitTypes(metadataMap) {
	const traitScores = {};
	const traitCounts = {}; // Object to store count of each trait_type occurrence

	// Count occurrences of each trait_type across all metadata
	for (const tokenId in metadataMap) {
		const metadata = metadataMap[tokenId];
		if (!metadata.attributes) {
			continue; // Skip if attributes are not defined
		}
		metadata.attributes.forEach((attribute) => {
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
		metadata.attributes.forEach((attribute) => {
			const traitType = attribute.trait_type;
			const traitCount = traitCounts[traitType];
			// Inverse normalization: 1 - (traitCount / totalTokens)
			traitScores[traitType] = traitScores[traitType] || 0;
			traitScores[traitType] += (1 - traitCount / (totalTokens + 1)) * 100;
		});
	}

	return { traitScores, traitCounts };
}

// Function to update metadata with scores for each trait_type and trait counts
function updateMetadataWithScores(metadataMap, traitScores, traitCounts) {
	for (const tokenId in metadataMap) {
		const metadata = metadataMap[tokenId];
		if (!metadata.attributes) {
			console.error(`Attributes not defined for token ${tokenId}`);
			continue; // Skip if attributes are not defined
		}
		metadata.attributes.forEach((attribute) => {
			const traitType = attribute.trait_type;
			attribute.score = traitScores[traitType];
			attribute.traitCount = traitCounts[traitType] || 0; // Add trait count to each attribute
		});

		// Remove "traits" field if it exists
		delete metadata.traits;
	}
}

// Function to calculate total rarity score for each token
function calculateTotalRarityScore(metadata) {
	let totalScore = 0;
	if (!metadata.attributes) {
		console.error('Attributes not defined for token metadata');
		return totalScore; // Return 0 if attributes are not defined
	}
	metadata.attributes.forEach((attribute) => {
		totalScore += attribute.score || 0; // Add the score of each attribute
	});
	return totalScore;
}

// Function to calculate rarity from metadata
function calculateRarityFromMetadata(metadataMap) {
	const rarityScores = {};
	for (const tokenId in metadataMap) {
		const metadata = metadataMap[tokenId];
		const totalRarityScore = calculateTotalRarityScore(metadata);
		rarityScores[tokenId] = totalRarityScore;
	}
	return rarityScores;
}

// Function to rank tokens based on rarity scores
function rankTokens(rarityScores) {
	const rankedTokens = [];

	// Sort tokens by rarity score in descending order
	const sortedTokens = Object.entries(rarityScores).sort((a, b) => b[1] - a[1]);

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

// Iterate through each token ID
async function main() {
	const tokenRarityScores = {};

	// Fetching totalSupply from the contract
	const fetchedTotalSupply = await contract.totalSupply();
	// const totalSupply = fetchedTotalSupply.toNumber();

	// for test until supply tokenid 25
	const totalSupply = fetchedTotalSupply;

	for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
		try {
			// Fetch token metadata
			const metadata = await fetchTokenMetadata(tokenId);
			if (metadata !== null) {
				tokenRarityScores[tokenId] = calculateTotalRarityScore(metadata);
				// Adjust image URL if necessary
				metadataMap[tokenId] = await adjustImageURL(metadata);
			} else {
				console.error(`Metadata not available for token ${tokenId}`);
			}
		} catch (error) {
			// Log the error and continue with next token
			console.error(`Error processing token ${tokenId}:`, error.message);
		}
	}

	// Calculate scores for each trait_type based on occurrence across all metadata
	const { traitScores, traitCounts } =
		calculateScoresForTraitTypes(metadataMap);

	// Update metadata with scores for each trait_type and trait counts
	updateMetadataWithScores(metadataMap, traitScores, traitCounts);

	// Rank tokens based on rarity scores
	const rarityScores = calculateRarityFromMetadata(metadataMap);
	const rankedTokens = rankTokens(rarityScores);

	// Include rarity data and trait counts in metadata
	for (const token of rankedTokens) {
		const tokenId = token.tokenId;
		const rarityData = {
			totalRarityScore: token.totalRarityScore,
			rank: token.rank,
		};
		metadataMap[tokenId].rarity = rarityData;
	}

	// Filter out tokens with null metadata (invalid token IDs)
	const filteredMetadataMap = {};
	for (const tokenId in metadataMap) {
		if (metadataMap[tokenId]) {
			if (metadataMap[tokenId].attributes) {
				filteredMetadataMap[tokenId] = metadataMap[tokenId];
			} else {
				console.error(`Metadata not available for token ${tokenId}`);
			}
		}
	}

	// Combine filtered metadata and rarity ranking into a single object
	const finalData = {
		metadata: filteredMetadataMap,
	};

	// Write final data to metadata.json
	fs.writeFileSync('metadata.json', JSON.stringify(finalData, null, 2), 'utf8');
	console.log('Updated metadata and final NFT ranking saved to metadata.json');
}

main();
