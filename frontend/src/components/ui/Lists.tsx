// import { useQuery, gql } from '@apollo/client'
// import { ethers } from 'ethers'
// import { useState } from 'react'
import { useNotices } from '@/hooks/useNotices'

// type Notice = {
//   id: string
//   index: number
//   input: any //{index: number; epoch: {index: number; }
//   payload: string
// }

const Lists = () => {
  const { notices } = useNotices()

  console.log('notices: ', notices)

  return (
    <div>
      hello
      {/* {notices
          ? JSON.parse(notices.reverse()[0].payload)
              .splice(0, endCursor)
              .map((eachNotice: any) => (
            
                <>
                  <div>{eachNotice.username}</div>
                </>
              ))
          : null} */}
    </div>
  )
}

export default Lists
