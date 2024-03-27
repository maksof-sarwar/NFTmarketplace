
export default {
  deployedNetwork: 14333,
  name: "vitruveo",
  MARKET_PLACE: {
    contractAddress: "0x6eF52610DA88Fb96B1b301666b2b1cf74AA6FD8e",
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'getApproved',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },

      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },

      {
        inputs: [
          {
            internalType: 'address',
            name: '_operator',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: '_approved',
            type: 'bool',
          },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },

      {
        constant: false,
        inputs: [
          {
            name: '_approved',
            type: 'address',
          },
          {
            name: '_tokenId',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },

      {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'creatorAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'CreatorFeeReceived',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'uint256',
            name: 'listingId',
            type: 'uint256',
          },
        ],
        name: 'ListingCancelled',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'uint256',
            name: 'listingId',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'newPrice',
            type: 'uint256',
          },
        ],
        name: 'ListingPriceEdited',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'uint256',
            name: 'listingId',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'seller',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'nftContract',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
        ],
        name: 'NFTListed',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'seller',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'buyer',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'nftContract',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
        ],
        name: 'NFTSold',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'platformAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'PlatformFeeReceived',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'seller',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'SellerReceived',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_nftContract',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_listingId',
            type: 'uint256',
          },
        ],
        name: 'buyNFT',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_listingId',
            type: 'uint256',
          },
        ],
        name: 'cancelListing',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'collectionInfos',
        outputs: [
          {
            internalType: 'address',
            name: 'nftContract',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'creatorAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'feePercentage',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_nftContract',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_newCreatorAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_newFeePercentage',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_newTotalSupply',
            type: 'uint256',
          },
        ],
        name: 'editCollectionInfo',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_listingId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_newPrice',
            type: 'uint256',
          },
        ],
        name: 'editListingPrice',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'feePercentage',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getAllListings',
        outputs: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'listingId',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'seller',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'nftContract',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'price',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'active',
                type: 'bool',
              },
            ],
            internalType: 'struct NFTMarketplace.Listing[]',
            name: '',
            type: 'tuple[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_nftContract',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_price',
            type: 'uint256',
          },
        ],
        name: 'listNFT',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'listings',
        outputs: [
          {
            internalType: 'uint256',
            name: 'listingId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftContract',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'nextListingId',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: '',
            type: 'bytes',
          },
        ],
        name: 'onERC721Received',
        outputs: [
          {
            internalType: 'bytes4',
            name: '',
            type: 'bytes4',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'owner',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'platformAddress',
        outputs: [
          {
            internalType: 'address payable',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_nftContract',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_creatorAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_feePercentage',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_totalSupply',
            type: 'uint256',
          },
        ],
        name: 'setCollectionInfo',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_feePercentage',
            type: 'uint256',
          },
        ],
        name: 'setFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_nftContract',
            type: 'address',
          },
          {
            internalType: 'uint256[]',
            name: '_listingIds',
            type: 'uint256[]',
          },
        ],
        name: 'sweepNFT',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'userStats',
        outputs: [
          {
            internalType: 'uint256',
            name: 'totalBuyVolume',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalSellVolume',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalTradingVolume',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'withdrawAllETH',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        stateMutability: 'payable',
        type: 'receive',
      },
    ]
  },
  NFT_CONTRACT: {
    abi: [
      {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{ "name": "_tokenId", "type": "uint256" }],
        "name": "tokenURI",
        "outputs": [{ "name": "", "type": "string" }],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_index", "type": "uint256" }],
        "name": "tokenOfOwnerByIndex",
        "outputs": [{ "name": "tokenId", "type": "uint256" }],
        "type": "function"
      }
    ]
  }
}