'use client'
import { ReactNode } from 'react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient('https://posh-fennec-35.convex.cloud')
// const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
