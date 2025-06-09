import { useMemo } from 'react'

const useAudio = (url: string): HTMLAudioElement => {
  const audio = useMemo<HTMLAudioElement>(() => new Audio(url), [url])

  return audio
}

export { useAudio }
