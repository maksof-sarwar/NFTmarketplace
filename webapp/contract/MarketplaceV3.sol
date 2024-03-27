// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTMarketplace is ERC721Holder {
    using SafeMath for uint256;

   struct Listing {
    uint256 collectionId; // New field to store the collection ID
    address seller;
    address nftContract;
    uint256 tokenId;
    uint256 price;
    bool active;
}


struct CollectionInfo {
    address nftContract;
    address withdrawalAddress;
    uint256 feePercentage;
    mapping(address => uint256) royaltyBalance;
    uint256 allTimeSalesVolume;
    uint256 salesVolume1Hour;
    uint256 salesVolume1Day;
    uint256 salesVolume7Days;
    uint256 salesVolume30Days;
    uint256 listedNFTs;
    uint256 totalSupply;
  
}


    mapping(address => uint256) public totalBuyVolume;
    mapping(address => uint256) public totalSellVolume;
    mapping(address => uint256) public buyerCount;
    mapping(address => uint256) public sellerCount;
    address public platformAddress;
    uint256 public nextCollectionId; // Variable to track the next collection ID
    mapping(uint256 => Listing) public listings;
    mapping(address => mapping(uint256 => CollectionInfo)) public collectionInfos; // Mapping of contract address to collection ID to CollectionInfo
    mapping(address => mapping(uint256 => uint256[])) internal saleTimestamps; // Mapping of contract address to collection ID to sale timestamps
    uint256 public nextListingId;
    address public owner;
    uint256 public feePercentage;

    constructor(address _platformAddress) {
        owner = msg.sender;
        feePercentage = 2; // Default fee percentage is 2%
        platformAddress = _platformAddress;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    function setFee(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 100, "Fee percentage cannot exceed 100%");
        feePercentage = _feePercentage;
    }


function setCollectionInfo(address _nftContract, address _withdrawalAddress, uint256 _feePercentage, uint256 _totalSupply) external onlyOwner {
    uint256 collectionId = nextCollectionId; // Assign the next available collection ID
    nextCollectionId++; // Increment the next collection ID for future use
    CollectionInfo storage collectionInfo = collectionInfos[_nftContract][collectionId];
    collectionInfo.nftContract = _nftContract;
    collectionInfo.withdrawalAddress = _withdrawalAddress;
    collectionInfo.feePercentage = _feePercentage;
    collectionInfo.totalSupply = _totalSupply; // Manually set the total supply

}



function editCollectionInfo(address _nftContract, uint256 _collectionId, address _newWithdrawalAddress, uint256 _newFeePercentage) external onlyOwner {
    CollectionInfo storage collectionInfo = collectionInfos[_nftContract][_collectionId];
    require(collectionInfo.nftContract == _nftContract, "Collection does not exist");
    collectionInfo.withdrawalAddress = _newWithdrawalAddress;
    collectionInfo.feePercentage = _newFeePercentage;

}



    function updateSalesVolumes(address _nftContract, uint256 _collectionId) internal {
    // Get the sale timestamps for the given collection
    uint256[] storage timestamps = saleTimestamps[_nftContract][_collectionId];

    // Update the all-time sales volume
    CollectionInfo storage collectionInfo = collectionInfos[_nftContract][_collectionId];
    collectionInfo.allTimeSalesVolume = timestamps.length;

    // Calculate sales volumes over different time intervals
    uint256 currentTimestamp = block.timestamp;
    uint256 salesVolume1Hour;
    uint256 salesVolume1Day;
    uint256 salesVolume7Days;
    uint256 salesVolume30Days;
    for (uint256 i = 0; i < timestamps.length; i++) {
        uint256 saleTimestamp = timestamps[i];
        uint256 timeDifference = currentTimestamp - saleTimestamp;

        // Update sales volumes based on time difference
        if (timeDifference <= 1 hours) {
            salesVolume1Hour++;
        }
        if (timeDifference <= 1 days) {
            salesVolume1Day++;
        }
        if (timeDifference <= 7 days) {
            salesVolume7Days++;
        }
        if (timeDifference <= 30 days) {
            salesVolume30Days++;
        }
    }

    // Update the sales volume fields in CollectionInfo
    collectionInfo.salesVolume1Hour = salesVolume1Hour;
    collectionInfo.salesVolume1Day = salesVolume1Day;
    collectionInfo.salesVolume7Days = salesVolume7Days;
    collectionInfo
    
    .salesVolume30Days = salesVolume30Days;
}

function addSaleTimestamp(address _nftContract, uint256 _collectionId) internal {
    uint256 currentTimestamp = block.timestamp;
    saleTimestamps[_nftContract][_collectionId].push(currentTimestamp);
}


function totalNFTListed() external {
    for (uint256 i = 0; i < nextListingId; i++) {
        Listing memory listing = listings[i];
        if (listing.active) {
            CollectionInfo storage collectionInfo = collectionInfos[listing.nftContract][listing.collectionId];
            collectionInfo.listedNFTs++;
        }
    }
}


 // Function to update buyer and seller counts and volumes after a successful sale
    function updateBuyerSellerInfo(address _buyer, address _seller, uint256 _amount) internal {
        totalBuyVolume[_buyer] += _amount;
        totalSellVolume[_seller] += _amount;
        buyerCount[_buyer]++;
        sellerCount[_seller]++;
    }

    // Function to get total buy volume for a user
    function getTotalBuyVolume(address _user) external view returns (uint256) {
        return totalBuyVolume[_user];
    }

    // Function to get total sell volume for a user
    function getTotalSellVolume(address _user) external view returns (uint256) {
        return totalSellVolume[_user];
    }

    // Function to get buyer count for a user
    function getBuyerCount(address _user) external view returns (uint256) {
        return buyerCount[_user];
    }

    // Function to get seller count for a user
    function getSellerCount(address _user) external view returns (uint256) {
        return sellerCount[_user];
    }




    event NFTListed(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId, uint256 price);
    event NFTSold(address indexed seller, address indexed buyer, address indexed nftContract, uint256 tokenId, uint256 price);
   


    function listNFT(address _nftContract, uint256 _tokenId, uint256 _price, uint256 _collectionId) external {
    IERC721 nft = IERC721(_nftContract);
    require(nft.ownerOf(_tokenId) == msg.sender, "You don't own this NFT");
    require(_price > 0, "Price should be greater than zero");

    nft.safeTransferFrom(msg.sender, address(this), _tokenId);

    uint256 listingId = nextListingId;
    nextListingId++;

    listings[listingId] = Listing({
        collectionId: _collectionId, // Store the collection ID
        seller: msg.sender,
        nftContract: _nftContract,
        tokenId: _tokenId,
        price: _price,
        active: true
    });

    emit NFTListed(listingId, msg.sender, _nftContract, _tokenId, _price);
}



function buyNFT(uint256 _listingId, uint256 _collectionId) external payable {
    Listing memory listing = listings[_listingId];
    require(listing.active, "NFT not listed");
    require(msg.value >= listing.price, "Insufficient payment");

    address payable seller = payable(listing.seller);
    uint256 price = listing.price;
    uint256 fee = price.mul(feePercentage).div(100); // Calculate fee based on fee percentage
    uint256 creatorFeePercentage = collectionInfos[listing.nftContract][_collectionId].feePercentage;
    uint256 creatorFee = price.mul(creatorFeePercentage).div(100); // Calculate creator fee based on creator fee percentage
    uint256 royaltyAmount = price.sub(fee).sub(creatorFee);
    address payable creatorAddress = payable (collectionInfos[listing.nftContract][_collectionId].withdrawalAddress);

    // Transfer the NFT to the buyer
    IERC721(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId);
    
    // Transfer the payment to the seller minus the fees
    seller.transfer(royaltyAmount);


   // Transfer the platform fee to the platform address
    payable(platformAddress).transfer(fee);

    // Transfer the creator fee directly to the creator's address
    payable(creatorAddress).transfer(creatorFee);


    // Add sale timestamp
    addSaleTimestamp(listing.nftContract, _collectionId);

    // Update sales volumes
    updateSalesVolumes(listing.nftContract, _collectionId);

    // Update buyer and seller information
    updateBuyerSellerInfo(msg.sender, seller, price);

    delete listings[_listingId];

    emit NFTSold(seller, msg.sender, listing.nftContract, listing.tokenId, price);
}

// Sweep Mode

function sweepNFT(uint256[] calldata _listingIds, uint256 _collectionId) external payable {
    uint256 totalAmount;
    address payable[] memory sellers = new address payable[](_listingIds.length);
    address[] memory nftContracts = new address[](_listingIds.length);
    uint256[] memory tokenIds = new uint256[](_listingIds.length);
    uint256[] memory prices = new uint256[](_listingIds.length);

    // Validate and calculate total amount
    for (uint256 i = 0; i < _listingIds.length; i++) {
        Listing memory listing = listings[_listingIds[i]];
        require(listing.active, "NFT not listed");
        totalAmount += listing.price;
        sellers[i] = payable(listing.seller);
        nftContracts[i] = listing.nftContract;
        tokenIds[i] = listing.tokenId;
        prices[i] = listing.price;
    }

    require(msg.value >= totalAmount, "Insufficient payment");

    // Transfer each NFT to the buyer
    for (uint256 i = 0; i < _listingIds.length; i++) {
        IERC721(nftContracts[i]).safeTransferFrom(address(this), msg.sender, tokenIds[i]);
    }

    // Distribute payments to sellers and fees
    for (uint256 i = 0; i < _listingIds.length; i++) {
        uint256 fee = prices[i].mul(feePercentage).div(100); // Calculate fee based on fee percentage
        uint256 creatorFeePercentage = collectionInfos[nftContracts[i]][_collectionId].feePercentage;
        uint256 creatorFee = prices[i].mul(creatorFeePercentage).div(100); // Calculate creator fee based on creator fee percentage
        uint256 royaltyAmount = prices[i].sub(fee).sub(creatorFee);
        address payable creatorAddress = payable(collectionInfos[nftContracts[i]][_collectionId].withdrawalAddress);

        sellers[i].transfer(royaltyAmount); // Transfer payment to seller minus the fees
        payable(platformAddress).transfer(fee); // Transfer the platform fee to the platform address
        payable(creatorAddress).transfer(creatorFee); // Transfer the creator fee directly to the creator's address

        // Add sale timestamp
        addSaleTimestamp(nftContracts[i], _collectionId);

        // Update sales volumes
        updateSalesVolumes(nftContracts[i], _collectionId);

        // Update buyer and seller information
        updateBuyerSellerInfo(msg.sender, sellers[i], prices[i]);

        emit NFTSold(sellers[i], msg.sender, nftContracts[i], tokenIds[i], prices[i]);
        delete listings[_listingIds[i]];
    }
}



    function cancelListing(uint256 _listingId) external {
        Listing memory listing = listings[_listingId];
        require(listing.seller == msg.sender, "You are not the seller");
        
        delete listings[_listingId];
        IERC721(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId);
    }

    function withdrawAllETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Contract balance is zero");
        payable(owner).transfer(balance);
    }


    function getCollectionIdsForContract(address _nftContract) external view returns (uint256[] memory) {
    uint256[] memory ids = new uint256[](nextCollectionId);
    uint256 count = 0;
    for (uint256 i = 0; i < nextCollectionId; i++) {
        if (collectionInfos[_nftContract][i].nftContract == _nftContract) {
            ids[count] = i;
            count++;
        }
    }
    return ids;
}


function getAllListings() external view returns (Listing[] memory) {
    Listing[] memory allListings = new Listing[](nextListingId);
    for (uint256 i = 0; i < nextListingId; i++) {
        allListings[i] = listings[i];
    }
    return allListings;
}


receive() external payable {}

}
