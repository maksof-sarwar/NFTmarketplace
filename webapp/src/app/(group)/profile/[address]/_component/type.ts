import { NftToken, NftTokenMetadata } from "@/types";
import { RouterOutputs } from "@marketplace/api";

export type NftTokenMetadataWithListed = RouterOutputs['collection']['getCollectionForUserProfile'][number];


export type UserNftToken = {
  tokenId: string;
  address: string;
}