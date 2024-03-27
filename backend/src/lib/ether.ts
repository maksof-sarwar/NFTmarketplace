import { ethers } from 'ethers';
import CONTRACT from '../../../contract'

const { abi, contractAddress } = CONTRACT.MARKET_PLACE
const provider = new ethers.providers.JsonRpcProvider(
  'https://test-rpc.vitruveo.xyz'
);

const contract = new ethers.Contract(contractAddress, abi, provider);

export { contract }