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
        address nftContract; // Added NFT contract address
        address withdrawalAddress;
        uint256 feePercentage;
        uint256 totalSalesAmount;
        mapping(address => uint256) royaltyBalance; // Mapping to track royalty balance for each creator
    }
    address public platformAddress;
    uint256 public nextCollectionId; // Variable to track the next collection ID
    mapping(uint256 => Listing) public listings;
    mapping(address => mapping(uint256 => CollectionInfo)) public collectionInfos; // Mapping of contract address to collection ID to CollectionInfo
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



function setCollectionInfo(address _nftContract, address _withdrawalAddress, uint256 _feePercentage) external onlyOwner {
    uint256 collectionId = nextCollectionId; // Assign the next available collection ID
    nextCollectionId++; // Increment the next collection ID for future use
    
    CollectionInfo storage collectionInfo = collectionInfos[_nftContract][collectionId];
    collectionInfo.nftContract = _nftContract;
    collectionInfo.withdrawalAddress = _withdrawalAddress;
    collectionInfo.feePercentage = _feePercentage;
    collectionInfo.totalSalesAmount = 0;
}


    function updateTotalSalesAmount(address _nftContract, uint256 _collectionId, uint256 _saleAmount) internal {
        collectionInfos[_nftContract][_collectionId].totalSalesAmount += _saleAmount;
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



    // Update total sales amount for the collection
    updateTotalSalesAmount(listing.nftContract, _collectionId, price);


    delete listings[_listingId];

    emit NFTSold(seller, msg.sender, listing.nftContract, listing.tokenId, price);
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




    receive() external payable {}
}
