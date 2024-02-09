/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'
import type { FunctionFragment, Result } from '@ethersproject/abi'
import type { Listener, Provider } from '@ethersproject/providers'
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from '../../common'

export interface ERC1155SinglePortalInterface extends utils.Interface {
  functions: {
    'depositSingleERC1155Token(address,address,uint256,uint256,bytes,bytes)': FunctionFragment
    'getInputBox()': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic: 'depositSingleERC1155Token' | 'getInputBox'
  ): FunctionFragment

  encodeFunctionData(
    functionFragment: 'depositSingleERC1155Token',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'getInputBox',
    values?: undefined
  ): string

  decodeFunctionResult(
    functionFragment: 'depositSingleERC1155Token',
    data: BytesLike
  ): Result
  decodeFunctionResult(functionFragment: 'getInputBox', data: BytesLike): Result

  events: {}
}

export interface ERC1155SinglePortal extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: ERC1155SinglePortalInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    /**
     * Transfer an ERC-1155 token to a DApp and add an input to the DApp's input box to signal such operation. The caller must enable approval for the portal to manage all of their tokens beforehand, by calling the `setApprovalForAll` function in the token contract.
     * @param _baseLayerData Additional data to be interpreted by the base layer
     * @param _dapp The address of the DApp
     * @param _execLayerData Additional data to be interpreted by the execution layer
     * @param _token The ERC-1155 token contract
     * @param _tokenId The identifier of the token being transferred
     * @param _value Transfer amount
     */
    depositSingleERC1155Token(
      _token: PromiseOrValue<string>,
      _dapp: PromiseOrValue<string>,
      _tokenId: PromiseOrValue<BigNumberish>,
      _value: PromiseOrValue<BigNumberish>,
      _baseLayerData: PromiseOrValue<BytesLike>,
      _execLayerData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    /**
     * Get the input box used by this input relay.
     */
    getInputBox(overrides?: CallOverrides): Promise<[string]>
  }

  /**
   * Transfer an ERC-1155 token to a DApp and add an input to the DApp's input box to signal such operation. The caller must enable approval for the portal to manage all of their tokens beforehand, by calling the `setApprovalForAll` function in the token contract.
   * @param _baseLayerData Additional data to be interpreted by the base layer
   * @param _dapp The address of the DApp
   * @param _execLayerData Additional data to be interpreted by the execution layer
   * @param _token The ERC-1155 token contract
   * @param _tokenId The identifier of the token being transferred
   * @param _value Transfer amount
   */
  depositSingleERC1155Token(
    _token: PromiseOrValue<string>,
    _dapp: PromiseOrValue<string>,
    _tokenId: PromiseOrValue<BigNumberish>,
    _value: PromiseOrValue<BigNumberish>,
    _baseLayerData: PromiseOrValue<BytesLike>,
    _execLayerData: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  /**
   * Get the input box used by this input relay.
   */
  getInputBox(overrides?: CallOverrides): Promise<string>

  callStatic: {
    /**
     * Transfer an ERC-1155 token to a DApp and add an input to the DApp's input box to signal such operation. The caller must enable approval for the portal to manage all of their tokens beforehand, by calling the `setApprovalForAll` function in the token contract.
     * @param _baseLayerData Additional data to be interpreted by the base layer
     * @param _dapp The address of the DApp
     * @param _execLayerData Additional data to be interpreted by the execution layer
     * @param _token The ERC-1155 token contract
     * @param _tokenId The identifier of the token being transferred
     * @param _value Transfer amount
     */
    depositSingleERC1155Token(
      _token: PromiseOrValue<string>,
      _dapp: PromiseOrValue<string>,
      _tokenId: PromiseOrValue<BigNumberish>,
      _value: PromiseOrValue<BigNumberish>,
      _baseLayerData: PromiseOrValue<BytesLike>,
      _execLayerData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>

    /**
     * Get the input box used by this input relay.
     */
    getInputBox(overrides?: CallOverrides): Promise<string>
  }

  filters: {}

  estimateGas: {
    /**
     * Transfer an ERC-1155 token to a DApp and add an input to the DApp's input box to signal such operation. The caller must enable approval for the portal to manage all of their tokens beforehand, by calling the `setApprovalForAll` function in the token contract.
     * @param _baseLayerData Additional data to be interpreted by the base layer
     * @param _dapp The address of the DApp
     * @param _execLayerData Additional data to be interpreted by the execution layer
     * @param _token The ERC-1155 token contract
     * @param _tokenId The identifier of the token being transferred
     * @param _value Transfer amount
     */
    depositSingleERC1155Token(
      _token: PromiseOrValue<string>,
      _dapp: PromiseOrValue<string>,
      _tokenId: PromiseOrValue<BigNumberish>,
      _value: PromiseOrValue<BigNumberish>,
      _baseLayerData: PromiseOrValue<BytesLike>,
      _execLayerData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    /**
     * Get the input box used by this input relay.
     */
    getInputBox(overrides?: CallOverrides): Promise<BigNumber>
  }

  populateTransaction: {
    /**
     * Transfer an ERC-1155 token to a DApp and add an input to the DApp's input box to signal such operation. The caller must enable approval for the portal to manage all of their tokens beforehand, by calling the `setApprovalForAll` function in the token contract.
     * @param _baseLayerData Additional data to be interpreted by the base layer
     * @param _dapp The address of the DApp
     * @param _execLayerData Additional data to be interpreted by the execution layer
     * @param _token The ERC-1155 token contract
     * @param _tokenId The identifier of the token being transferred
     * @param _value Transfer amount
     */
    depositSingleERC1155Token(
      _token: PromiseOrValue<string>,
      _dapp: PromiseOrValue<string>,
      _tokenId: PromiseOrValue<BigNumberish>,
      _value: PromiseOrValue<BigNumberish>,
      _baseLayerData: PromiseOrValue<BytesLike>,
      _execLayerData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    /**
     * Get the input box used by this input relay.
     */
    getInputBox(overrides?: CallOverrides): Promise<PopulatedTransaction>
  }
}
