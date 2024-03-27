import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
const tokenContractABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
];
// Initialize provider (you can use different providers like Infura, etc.)
const provider = new ethers.providers.JsonRpcProvider("https://test-rpc.vitruveo.xyz");

export function useTokenHolderCount(contractAddress: string) {
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState(0);
  const fetchOwner = useCallback(async (contract: ethers.Contract) => {
    setLoading(true);
    try {
      // Initialize a Set to store unique token holders' addresses
      const holdersSet = new Set();
      const _totalSupply = await contract.totalSupply();
      const totalSupply = _totalSupply.toNumber();
      const owners = await Promise.allSettled(
        Array.from({ length: totalSupply })
          .map<{ uri: string; tokenId: string }>((_, tokenId) => {
            return contract.ownerOf(tokenId)
          })
      );
      for (const owner of owners) {
        if (owner.status === 'fulfilled') {
          holdersSet.add(owner.value)
        }
      }
      setOwner(holdersSet.size)
    } catch (error) {
      console.error("Error fetching token holders count:", error);
      setOwner(0)
    } finally {
      setLoading(false)
    }
  }, [contractAddress])
  useEffect(() => {
    const contract = new ethers.Contract(contractAddress, tokenContractABI, provider);
    fetchOwner(contract)
  }, [contractAddress])





  return { owner, loading }
}
