export interface Collection {
  address: string;
  banner: string;
  logo: string;
  name: string;
  released: boolean;
  floorPrice: number;
  '1hVolume': number;
  '24hVolume': number;
  '7dVolume': number;
  '30dVolume': number;
  'totalVolume': number;
  totalSupply: number;
  slug: string;
};



export interface CollectionTable {
  collection: CollectionInfo
  floor: Floor
  volume: Volume
  '1hVolume'?: N24hVolume;
  '24hVolume'?: N24hVolume;
  '7dVolume'?: N24hVolume;
  '30dVolume'?: N24hVolume;
  'totalVolume'?: N24hVolume;
  supply: number
  address: string;
  slug: string;
}

export interface CollectionInfo {
  img: string
  name: string
}

export interface Floor {
  value: string
  inUsd: string
}

export interface Volume {
  value: string
  inUsd: string
}

export interface N24hVolume {
  value: string
  inUsd: string
}
