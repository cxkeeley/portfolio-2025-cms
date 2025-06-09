import { useCallback, useEffect, useRef } from 'react'

type ScanEntry = {
  key: string
  timeStamp: number
}

const KEYPRESS_INTERVAL = 50

const useBarcodeScanner = () => {
  const scan = useRef<Array<ScanEntry>>([])

  const onScanned = useCallback((callbackFn: (key: string) => void) => {
    document.addEventListener('scan-completed', (e) => {
      const event = e as CustomEvent<string>
      callbackFn(event.detail)
    })
  }, [])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (scan.current.length > 0 && e.timeStamp - scan.current.slice(-1)[0].timeStamp > KEYPRESS_INTERVAL) {
      scan.current = []
    }

    if (e.key === 'Enter' && scan.current.length > 0) {
      let scannedString = scan.current.reduce((prev, entry) => {
        return prev + entry.key
      }, '')

      scan.current = []

      return document.dispatchEvent(
        new CustomEvent('scan-completed', {
          detail: scannedString,
        })
      )
    }

    if (e.key !== 'Shift') {
      scan.current.push({
        key: e.key,
        timeStamp: e.timeStamp,
      })
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return { onScanned }
}

export { useBarcodeScanner }
