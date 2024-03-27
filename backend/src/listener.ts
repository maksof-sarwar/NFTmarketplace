import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { contract } from './lib/ether';
import { Listing, cancelListing, createListing, createSold, updateListingPrice } from './lib/listing';
import { convertBigNumber } from './lib/utils';
import { BigNumberish } from 'ethers/utils';


class ContractListener {
  constructor() {
    this.nftList()
    this.listingCancelled()
    this.listingPriceEdited()
    this.soldNft()
  }
  nftList() {
    contract.on('NFTListed', async (_listingId: BigNumber, seller: string, nftContract: string, _tokenId: BigNumber, _price: BigNumberish, event: ethers.Event) => {
      const obj = {
        listingId: _listingId,
        tokenId: _tokenId,
        price: _price,
        seller,
        nftContract,
        tx: event.transactionHash,
        active: true,
      } as Listing
      try {
        console.log('NFTListed ', 'tokenId : ', convertBigNumber(obj.tokenId), 'listingId : ', convertBigNumber(obj.listingId));
        await createListing(obj)
      } catch (err: any) {
        console.error("error", err.message, `listingId: ${convertBigNumber(obj.listingId)}`);
      }
    })
  }
  listingCancelled() {
    contract.on('ListingCancelled', async (_listingId: BigNumber, event: ethers.Event) => {
      const obj = {
        listingId: _listingId,
        tx: event.transactionHash
      }
      try {
        console.log('ListingCancelled', `listingId: ${convertBigNumber(obj.listingId)}`);
        await cancelListing(obj.listingId)
      } catch (error: any) {
        console.error("error ListingCancelled", error.message, `listingId: ${convertBigNumber(obj.listingId)}`);
      }
    })
  }

  listingPriceEdited() {
    contract.on('ListingPriceEdited', async (_listingId: BigNumber, _price: BigNumberish, event: ethers.Event) => {
      const obj = {
        listingId: _listingId,
        price: _price,
        tx: event.transactionHash
      }
      try {
        console.log('ListingPriceEdited', `listingId: ${convertBigNumber(obj.listingId)}`);
        await updateListingPrice(obj.listingId, obj.price)
      } catch (error: any) {
        console.error("error ListingPriceEdited", error.message, `listingId: ${convertBigNumber(obj.listingId)}`);
      }
    })
  }


  soldNft() {
    contract.on('NFTSold', async (seller: string, buyer: string, nftContract: string, _tokenId: BigNumber, _price: BigNumberish, event: ethers.Event) => {
      const obj = {
        tokenId: _tokenId,
        price: _price,
        seller,
        buyer,
        nftContract,
      } as const
      try {
        console.log('NFTSold ', 'tokenId : ', convertBigNumber(obj.tokenId));
        await createSold(obj)
      } catch (err: any) {
        console.error("error NFTSold", err.message);
      }
    })
  }
}


export { ContractListener }