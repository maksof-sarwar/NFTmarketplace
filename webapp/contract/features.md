Contract Structure

It uses various libraries like Counters and Address.
It defines a MarketItem struct to represent items listed in the marketplace.
It maintains a mapping to store market items.
It emits events for item creation.
Constructor
The constructor initializes the contract owner and sets a default fee percentage.
Core Functions
createMarketItem: Allows users to list an NFT for sale in the marketplace. It transfers the NFT to the contract.

unlistMarketItem: Allows the seller to remove a listed item from the marketplace.

createMarketSaleWithToken: Allows users to purchase an NFT using ERC20 tokens. It transfers tokens from the buyer to the seller and the marketplace fees to the owner.

createMarketSaleWithETH: Allows users to purchase an NFT using ETH. It transfers ETH from the buyer to the seller and the marketplace fees to the owner.

Utility Functions
fetchMarketItems: Retrieves all unsold market items.
fetchMyNFTs: Retrieves NFTs owned by the caller.
fetchItemsCreated: Retrieves items created by the caller.
fetchSellerOfMarketItem: Retrieves the seller of a specific market item.
fetchPriceOfMarketItem: Retrieves the price of a specific market item.
fetchBuyerOfMarketItem: Retrieves the buyer of a specific market item.
Additional Features
Fee mechanism: Fees are deducted from each sale and sent to the owner of the contract.
Reentrancy guard: Prevents reentrancy attacks in critical functions.
Owner management: Allows the owner to set the fee percentage and change the owner address