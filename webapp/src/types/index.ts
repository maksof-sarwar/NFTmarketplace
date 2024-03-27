import { RouterOutputs } from "@marketplace/api";
import { ACTIVITY_TYPE } from "@marketplace/db";

export type Collection = RouterOutputs['collection']['getByAddress'] & { metadata: CollectionMetadata };

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


export interface NftToken {
  listingId: number
  nftContract: string
  tokenId: number
  price: string
  seller: string
  metadata: NftTokenMetadata;
  active: boolean
}



export interface NftTokenMetadata {
  name: string
  image: string
  description: string
  external_url: string
  tokenId: number;
  nftContract: string;
  attributes?: NftTokenMetadataAttributes[]
}


export interface NftTokenMetadataAttributes {
  name: string;
  value: string;
  meta?: any;
  trait_type?: string;
}



export type TokenWithCollection = NftToken & { collection: Collection | undefined };


export type CollectionStats = {
  floor: number;
  '24hVolume': number;
  totalVolume: number;
  owner: number;
  items: number;
  listed: number;
};



export interface TokenMetadata {
  id: string
  name: string
  image: string
  rarity: Rarity
  createdAt: number
  updatedAt: number
  attributes: Attribute[]
}

export interface Rarity {
  rank: number
  totalRarityScore: number
}

export interface Attribute {
  score: number
  value: string
  traitCount: number
  trait_type: string
}



export type Activity = RouterOutputs['collection']['getCollectionActivity']['activities'][number]





export interface CollectionTokens {
  id: string
  token_id: string;
  address: string;
  collection_id: string
  image: string
  name: string
  metadata: string
  created_at: string
  updated_at: string
  attributes: string;
  type: ACTIVITY_TYPE;
  rarity: string
  price: string
  active: boolean
  listingId: string
  seller: string
  total_supply: number
}
