import CONTRACT from '@/../contract';
import { useContract } from "@/hooks/use-contract";
import { NftToken, NftTokenMetadata } from "@/types";
import { Contract } from "web3";
import { convertBigNumber } from "./utils";
const { NFT_CONTRACT } = CONTRACT
export async function* getAllListingsByContractAddress({
  address,
  withMetadata = false
}: {
  address: string;
  withMetadata?: boolean
}) {
  const { web3, contract } = useContract.getState();
  if (!web3 || !contract) return undefined;

  const _listings = (await contract.methods.getAllListings().call()) as any[];
  const listings = _listings.filter(
    (listing) => listing.nftContract.toLowerCase() === address.toLowerCase()
  );

  for (const listing of listings) {
    const listingId = convertBigNumber(listing.listingId);
    const tokenId = convertBigNumber(listing.tokenId);
    const contract = new web3.eth.Contract<typeof NFT_CONTRACT.abi>(
      NFT_CONTRACT.abi,
      listing.nftContract
    );
    let metadata: NftTokenMetadata | undefined = undefined;
    if (withMetadata) {
      metadata = await getTokenMetadata(tokenId, contract);
    }
    yield {
      listingId,
      metadata,
      active: listing.active,
      nftContract: listing.nftContract,
      price: web3.utils.fromWei(listing.price, 'ether'),
      seller: listing.seller,
      tokenId,
    } as NftToken;
  }
}


export async function getTokenMetadata(
  tokenId: number,
  nftContract: Contract<typeof NFT_CONTRACT.abi>
) {

  const token = await nftContract.methods
    .tokenURI(tokenId)
    .call()
    .then((tokenURI) => ({
      tokenId,
      tokenURI: tokenURI as unknown as string,
    }));
  const metadata = await fetchMetadata(token.tokenURI)
  return { ...metadata, tokenId: convertBigNumber(tokenId), };
};



async function fetchMetadata(tokenURI: string): Promise<NftTokenMetadata> {
  const metadata = await fetch(tokenURI).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
  if (metadata.image && typeof metadata.image === 'string') {
    metadata.image = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  if (metadata.attributes) {
    if (!Array.isArray(metadata.attributes)) {
      metadata.attributes = Object.entries(metadata.attributes).map(([key, value], idx) => ({ name: key, value }))
    }
  }
  return metadata;
}
