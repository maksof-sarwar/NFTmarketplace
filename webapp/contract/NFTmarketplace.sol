// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTMarketplace is ERC721Holder {
    using SafeMath for uint256;

    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId;
    address public owner;
    uint256 public feePercentage;
    constructor() {
        owner = msg.sender;
        feePercentage = 2; // Default fee percentage is 2%
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    function setFee(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 100, "Fee percentage cannot exceed 100%");
        feePercentage = _feePercentage;
    }

    event NFTListed(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId, uint256 price);
    event NFTSold(address indexed seller, address indexed buyer, address indexed nftContract, uint256 tokenId, uint256 price);

    function listNFT(address _nftContract, uint256 _tokenId, uint256 _price) external {
        IERC721 nft = IERC721(_nftContract);
        require(nft.ownerOf(_tokenId) == msg.sender, "You don't own this NFT");
        require(_price > 0, "Price should be greater than zero");

        nft.safeTransferFrom(msg.sender, address(this), _tokenId);

        uint256 listingId = nextListingId;
        nextListingId++;

        listings[listingId] = Listing({
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            price: _price,
            active: true
        });

        emit NFTListed(listingId, msg.sender, _nftContract, _tokenId, _price);
    }

    function buyNFT(uint256 _listingId) external payable {
        Listing memory listing = listings[_listingId];
        require(listing.active, "NFT not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        address payable seller = payable(listing.seller);
        uint256 price = listing.price;
        uint256 fee = price.mul(feePercentage).div(100); // Calculate fee based on fee percentage
        uint256 amountAfterFee = price.sub(fee);

        // Transfer the NFT to the buyer
        IERC721(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId);
        
        // Transfer the payment to the seller minus the fee
        seller.transfer(amountAfterFee);

        // Transfer the fee to the contract address
        payable(address(this)).transfer(fee);

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

      receive() external payable {}
}
