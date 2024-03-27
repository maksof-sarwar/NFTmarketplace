import BigNumber from "bignumber.js"

export const convertBigNumber = (...args: Parameters<typeof BigNumber>) => {
  return new BigNumber(...args).toNumber().toString()
}

