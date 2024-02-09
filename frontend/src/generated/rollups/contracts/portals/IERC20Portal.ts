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

export interface IERC20PortalInterface extends utils.Interface {
  functions: {
    'depositERC20Tokens(address,address,uint256,bytes)': FunctionFragment
    'getInputBox()': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic: 'depositERC20Tokens' | 'getInputBox'
  ): FunctionFragment

  encodeFunctionData(
    functionFragment: 'depositERC20Tokens',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'getInputBox',
    values?: undefined
  ): string

  decodeFunctionResult(
    functionFragment: 'depositERC20Tokens',
    data: BytesLike
  ): Result
  decodeFunctionResult(functionFragment: 'getInputBox', data: BytesLike): Result

  events: {}
}

export interface IERC20Portal extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: IERC20PortalInterface

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
     * Transfer ERC-20 tokens to a DApp and add an input to the DApp's input box to signal such operation. The caller must allow the portal to withdraw at least `_amount` tokens from their account beforehand, by calling the `approve` function in the token contract.
     * @param _amount The amount of tokens to be transferred
     * @param _dapp The address of the DApp
     * @param _execLayerData Additional data to be interpreted by the execution layer
     * @param _token The ERC-20 token contract
     */
    depositERC20Tokens(
      _token: PromiseOrValue<string>,
      _dapp: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      _execLayerData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    /**
     * Get the input box used by this input relay.
     */
    getInputBox(overrides?: CallOverrides): Promise<[string]>
  }

  /**
   * Transfer ERC-20 tokens to a DApp and add an input to the DApp's input box to signal such operation. The caller must allow the portal to withdraw at least `_amount` tokens from their account beforehand, by calling the `approve` function in the token contract.
   * @param _amount The amount of tokens to be transferred
   * @param _dapp The address of the DApp
   * @param _execLayerData Additional data to be interpreted by the execution layer
   * @param _token The ERC-20 token contract
   */
  depositERC20Tokens(
    _token: PromiseOrValue<string>,
    _dapp: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    _execLayerData: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  /**
   * Get the input box used by this input relay.
   */
  getInputBox(overrides?: CallOverrides): Promise<string>

  callStatic: {
    /**
     * Transfer ERC-20 tokens to a DApp and add an input to the DApp's input box to signal such operation. The caller must allow the portal to withdraw at least `_amount` tokens from their account beforehand, by calling the `approve` function in the token contract.
     * @param _amount The amount of tokens to be transferred
     * @param _dapp The address of the DApp
     * @param _execLayerData Additional data to be interpreted by the execution layer
     * @param _token The ERC-20 token contract
     */
    depositERC20Tokens(
      _token: PromiseOrValue<string>,
      _dapp: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
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
     * Transfer ERC-20 tokens to a DApp and add an input to the DApp's input box to signal such operation. The caller must allow the portal to withdraw at least `_amount` tokens from their account beforehand, by calling the `approve` function in the token contract.
     * @param _amount The amount of tokens to be transferred
     * @param _dapp The address of the DApp
     * @param _execLayerData Additional data to be interpreted by the execution layer
     * @param _token The ERC-20 token contract
     */
    depositERC20Tokens(
      _token: PromiseOrValue<string>,
      _dapp: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
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
     * Transfer ERC-20 tokens to a DApp and add an input to the DApp's input box to signal such operation. The caller must allow the portal to withdraw at least `_amount` tokens from their account beforehand, by calling the `approve` function in the token contract.
     * @param _amount The amount of tokens to be transferred
     * @param _dapp The address of the DApp
     * @param _execLayerData Additional data to be interpreted by the execution layer
     * @param _token The ERC-20 token contract
     */
    depositERC20Tokens(
      _token: PromiseOrValue<string>,
      _dapp: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      _execLayerData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    /**
     * Get the input box used by this input relay.
     */
    getInputBox(overrides?: CallOverrides): Promise<PopulatedTransaction>
  }
}
