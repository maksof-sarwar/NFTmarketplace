import { prisma } from '@marketplace/db';
import { contract } from './lib/ether';
import { ContractListener } from './listener';
import { convertBigNumber } from './lib/utils';
import { ethers } from 'ethers';
import { startFetchingToken } from './lib/fetching-token-cron';
import { cancelListing } from './lib/listing';
import BigNumber from 'bignumber.js';
import { SocketHandler } from '@marketplace/socket/server'
const contractAddress = '0x7146b9eD956D091f833DE7dF39e6f09f71685353';



new ContractListener()
new SocketHandler(9000)
startFetchingToken()


// const start = async () => {
//   let i = 0
//   setInterval(() => {
//     if (i >= 100) {
//       i = 0
//     }
//     SocketHandler.instance.io.emit('token_fetching_progress', {
//       address: contractAddress,
//       progress: i
//     })
//     i++
//   }, 5000)
// }
// start()