import { useRef, useEffect } from 'react'

export default function useAudio(src: string) {
  const audioRef = useRef(new Audio(src))

  useEffect(() => {
    audioRef.current.src = src
  }, [src])

  return audioRef.current
}
