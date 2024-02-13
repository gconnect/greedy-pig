'use client'

import { FC, createContext, useContext, useState } from 'react'
import { dappAddress } from '@/lib/utils'
import { useConnectWallet } from '@web3-onboard/react'
import { useNotices } from '@/hooks/useNotices'
import { Address } from '@web3-onboard/core/dist/types'

interface IConnectContext {
  wallet: any
  connecting: boolean
  connect: any
  disconnect: any
  baseDappAddress: string
  updateBaseDappAddress: any
  currentUser: ICurrentUser[]
  updateCurrentUser: any
  userCreated: boolean
  data: any
  error: any
  loading: any
  notices: any
}

const ConnectContext = createContext<IConnectContext>({
  wallet: null,
  connecting: false,
  connect: null,
  disconnect: null,
  baseDappAddress: '',
  updateBaseDappAddress: null,
  currentUser: [
    {
      username: '',
      address: '',
      bio: '',
    },
  ],
  updateCurrentUser: null,
  userCreated: false,
  data: null,
  error: null,
  loading: null,
  notices: null,
})

export interface ConnectProviderProps<T = {}> {
  children: React.ReactNode | React.ReactNode[] | null
}

interface ICurrentUser {
  username: string
  address: Address
  bio: string
}

const ConnectProvider: FC<ConnectProviderProps<any>> = ({
  children,
}: ConnectProviderProps<any>) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const { data, notices, loading, error } = useNotices()

  const [baseDappAddress, setBaseDappAddress] = useState<string>(dappAddress)
  const [currentUser, setCurrentUser] = useState<ICurrentUser[] | any>()

  const userCreated = currentUser ? currentUser?.length > 0 : false

  const updateBaseDappAddress = (newDappAddress: string) => {
    setBaseDappAddress(newDappAddress)
    console.log(baseDappAddress)
    console.log(newDappAddress)
  }

  const updateCurrentUser = (_user: ICurrentUser) => {
    setCurrentUser(_user)
  }

  return (
    <ConnectContext.Provider
      value={{
        wallet,
        connecting,
        connect,
        disconnect,
        baseDappAddress,
        updateBaseDappAddress,
        currentUser,
        updateCurrentUser,
        userCreated,
        data,
        error,
        loading,
        notices,
      }}
    >
      {children}
    </ConnectContext.Provider>
  )
}

export const useConnectContext = () => useContext(ConnectContext)

export default ConnectProvider
