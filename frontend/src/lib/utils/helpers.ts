import { fromHex } from 'viem'

export const shortenAddress = (addr: string) => {
  return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`
}

export const capitalize = (word: string) =>
  `${word?.substring(0, 1).toUpperCase()}${word?.substring(1)}`

export const parseInputEvent = (input: `0x${string}`) => {
  let result = fromHex(input, 'string')
  return JSON.parse(JSON.parse(result))
}
