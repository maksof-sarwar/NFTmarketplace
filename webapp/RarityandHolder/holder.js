const { ethers } = require("ethers");

// Initialize provider (you can use different providers like Infura, etc.)
const provider = new ethers.providers.JsonRpcProvider("https://test-rpc.vitruveo.xyz");

// Address of the ERC-20 token contract
const tokenContractAddress = "0x7C7FBB934FB96b2355DcA0e14Ad178DF24a6461f";

// ABI of the ERC-721 token contract
const tokenContractABI = [
    // ERC-721 Standard functions
    "function ownerOf(uint256 tokenId) view returns (address)"
  ];
  
  async function getTokenHoldersCount() {
    const contract = new ethers.Contract(tokenContractAddress, tokenContractABI, provider);
  
    try {
      // Initialize a Set to store unique token holders' addresses
      const holdersSet = new Set();
  
      // Loop through all possible token IDs until a non-existent one is found
      let tokenId = 0;
      let owner;
      do {
        try {
          owner = await contract.ownerOf(tokenId);
          holdersSet.add(owner);
          tokenId++;
        } catch (error) {
          // If ownerOf throws an error, it means the token ID doesn't exist
          break;
        }
      } while (true);
  
      console.log("Number of token holders:", holdersSet.size);
    } catch (error) {
      console.error("Error fetching token holders count:", error);
    }
  }
  
  getTokenHoldersCount();