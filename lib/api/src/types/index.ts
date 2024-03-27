export type CollectionMetadata = {
  name: string;
  description?: string;
  discord?: string;
  twitter?: string;
  telegram?: string;
  web?: string;
  totalSupply: number;
  contractAddress: string;
  creatorAddress: string
}



export type TopCollection = {
  metadata: CollectionMetadata,
  address: string;
  slug: string;
  floorPrice: string;
  lastFloorPrice: string;
  sold_activity_count: string,
  id: string
  logo: string,
  banner: string
  volume: number;
  rank: number;
  traits: any
}