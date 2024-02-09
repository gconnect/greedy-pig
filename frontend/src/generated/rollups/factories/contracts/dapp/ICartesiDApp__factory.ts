/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers'
import type { Provider } from '@ethersproject/providers'
import type {
  ICartesiDApp,
  ICartesiDAppInterface,
} from '../../../contracts/dapp/ICartesiDApp'

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IConsensus',
        name: 'newConsensus',
        type: 'address',
      },
    ],
    name: 'NewConsensus',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'voucherId',
        type: 'uint256',
      },
    ],
    name: 'VoucherExecuted',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_destination',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_payload',
        type: 'bytes',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'uint64',
                name: 'inputIndexWithinEpoch',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'outputIndexWithinInput',
                type: 'uint64',
              },
              {
                internalType: 'bytes32',
                name: 'outputHashesRootHash',
                type: 'bytes32',
              },
              {
                internalType: 'bytes32',
                name: 'vouchersEpochRootHash',
                type: 'bytes32',
              },
              {
                internalType: 'bytes32',
                name: 'noticesEpochRootHash',
                type: 'bytes32',
              },
              {
                internalType: 'bytes32',
                name: 'machineStateHash',
                type: 'bytes32',
              },
              {
                internalType: 'bytes32[]',
                name: 'outputHashInOutputHashesSiblings',
                type: 'bytes32[]',
              },
              {
                internalType: 'bytes32[]',
                name: 'outputHashesInEpochSiblings',
                type: 'bytes32[]',
              },
            ],
            internalType: 'struct OutputValidityProof',
            name: 'validity',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'context',
            type: 'bytes',
          },
        ],
        internalType: 'struct Proof',
        name: '_proof',
        type: 'tuple',
      },
    ],
    name: 'executeVoucher',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getConsensus',
    outputs: [
      {
        internalType: 'contract IConsensus',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTemplateHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IConsensus',
        name: '_newConsensus',
        type: 'address',
      },
    ],
    name: 'migrateToConsensus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_notice',
        type: 'bytes',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'uint64',
                name: 'inputIndexWithinEpoch',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'outputIndexWithinInput',
                type: 'uint64',
              },
              {
                internalType: 'bytes32',
                name: 'outputHashesRootHash',
                type: 'bytes32',
              },
              {
                internalType: 'bytes32',
                name: 'vouchersEpochRootHash',
                type: 'bytes32',
              },
              {
                internalType: 'bytes32',
                name: 'noticesEpochRootHash',
                type: 'bytes32',
              },
              {
                internalType: 'bytes32',
                name: 'machineStateHash',
                type: 'bytes32',
              },
              {
                internalType: 'bytes32[]',
                name: 'outputHashInOutputHashesSiblings',
                type: 'bytes32[]',
              },
              {
                internalType: 'bytes32[]',
                name: 'outputHashesInEpochSiblings',
                type: 'bytes32[]',
              },
            ],
            internalType: 'struct OutputValidityProof',
            name: 'validity',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'context',
            type: 'bytes',
          },
        ],
        internalType: 'struct Proof',
        name: '_proof',
        type: 'tuple',
      },
    ],
    name: 'validateNotice',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_inputIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_outputIndexWithinInput',
        type: 'uint256',
      },
    ],
    name: 'wasVoucherExecuted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export class ICartesiDApp__factory {
  static readonly abi = _abi
  static createInterface(): ICartesiDAppInterface {
    return new utils.Interface(_abi) as ICartesiDAppInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICartesiDApp {
    return new Contract(address, _abi, signerOrProvider) as ICartesiDApp
  }
}
