import { ethers } from 'ethers'

export const addInput = async (
  data: string,
  dappAddress: string,
  rollups: any
) => {
  if (rollups) {
    try {
      let payload = ethers.utils.toUtf8Bytes(data)

      return await rollups.inputContract.addInput(dappAddress, payload)
    } catch (e) {
      console.log(`${e}`)
    }
  }
}
