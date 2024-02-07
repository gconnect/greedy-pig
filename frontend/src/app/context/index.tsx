'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { defaultDappAddress } from '../../utils/constants'
import { useConnectWallet } from '@web3-onboard/react'
import { useNotices } from '../../hooks/useNotices'
import { Address } from '@web3-onboard/core/dist/types'

interface IPeepsContext {
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

const PeepsContext = createContext<IPeepsContext>({
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

export interface PeepsProviderProps {
  children: React.ReactNode | React.ReactNode[] | null
}

interface ICurrentUser {
  username: string
  address: Address
  bio: string
}

const PeepsProvider: React.FC<PeepsProviderProps<any>> = ({
  children,
}: PeepsProviderProps) => {
  const [baseDappAddress, setBaseDappAddress] =
    useState<string>(defaultDappAddress)
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [currentUser, setCurrentUser] = useState<ICurrentUser[] | any>()

  const { data, notices, loading, error } = useNotices()

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
    <PeepsContext.Provider
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
    </PeepsContext.Provider>
  )
}

export const usePeepsContext = () => useContext(PeepsContext)

export default PeepsProvider
