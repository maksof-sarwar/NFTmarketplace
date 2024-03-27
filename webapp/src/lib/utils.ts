import BigNumber from "bignumber.js";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatCurrency = (amount: number | string | bigint, currency: 'SEI' | 'USD' = 'SEI', currencyDisplay: 'name' | 'symbol' = 'name') => {
  amount = typeof amount === 'string' ? Number(amount) : amount;
  return `${amount}`
  // return new Intl.NumberFormat('en-US', {
  //   style: 'currency',
  //   currency,
  //   minimumFractionDigits: 0,
  //   currencyDisplay,
  // }).format(amount).replace(/SEI/g, 'VTRU');
}


export const formatNumber = (num: number | string) => {
  num = typeof num === 'string' ? Number(num) : num;
  return Intl.NumberFormat('en', { notation: 'compact' }).format(roundNumber(num));
}


export const convertBigNumber = (...args: Parameters<typeof BigNumber>) => {
  return new BigNumber(...args).toNumber()
}


export function shortenAddress(address: string, length: number = 6): string {
  if (address.length <= 2 + length * 2) {
    return address;
  }
  return address.slice(0, length) + '...' + address.slice(-length);
}



export const roundNumber = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100


export const formatTokenName = (name: string, id: string) => name?.replace(/#(\d+)/, '').concat(' #', id)

export function removeEmptyValues(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};

  Object.entries(obj).forEach(([key, value]: any) => {
    if (Array.isArray(value)) {
      const filteredArray = value.filter((item) =>
        Object.values(item).every((val) => val !== '')
      );
      if (filteredArray.length > 0) {
        newObj[key] = filteredArray;
      }
    } else if (typeof value === 'object' && value !== null) {
      const nestedObj = removeEmptyValues(value);
      if (Object.keys(nestedObj).length > 0) {
        newObj[key] = nestedObj;
      }
    } else if (value !== '') {
      newObj[key] = value;
    }
  });

  return newObj;
}




export function isDateGreaterThanIntervalAgo(dateToCheck: Date | string, intervalInHours: number): boolean {
  dateToCheck = typeof dateToCheck === 'string' ? new Date(dateToCheck) : dateToCheck;
  const intervalInMilliseconds: number = intervalInHours * 60 * 60 * 1000; // Convert hours to milliseconds
  const currentDateTime: Date = new Date();
  const intervalAgo: Date = new Date(currentDateTime.getTime() - intervalInMilliseconds);

  return dateToCheck.getTime() > intervalAgo.getTime();
}





export function calulateUserPoints(buyVolume: number, buyCounts: number) {
  return formatNumber(buyVolume + (buyCounts * 0.25))
}

export const rankColor = (rank: number | string, totalSupply: number | string) => {
  const percent = Number(rank) / Number(totalSupply) * 100;
  if (percent <= 0.25) {
    return 'bg-[#ECC94B] hover:bg-[#ECC94B]/70';
  } else if (percent <= 10) {
    return 'bg-[#805AD5] hover:bg-[#805AD5]/70';
  } else if (percent <= 25) {
    return 'bg-[#18de26] hover:bg-[#18de26]/70';
  } else if (percent <= 60) {
    return 'bg-[#0e6bed] hover:bg-[#0e6bed]/70';
  } else {
    return 'bg-[#828582] hover:bg-[#828582]/70';
  }
}