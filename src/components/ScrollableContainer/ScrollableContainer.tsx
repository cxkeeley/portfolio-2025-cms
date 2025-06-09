import { FC, useCallback, useEffect, useRef } from 'react'
import { PropsWithChildren } from 'react'

type Props = {
  next: () => void
  hasNextPage?: boolean
  className?: string
}

const ScrollableContainer: FC<PropsWithChildren<Props>> = ({ children, next, hasNextPage, className }) => {
  const loader = useRef(null)

  const handleObserver = useCallback(
    (entries: Array<IntersectionObserverEntry>) => {
      const target = entries[0]

      if (target.isIntersecting && hasNextPage) {
        next()
      }
    },
    [hasNextPage, next]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    })

    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => observer.disconnect()
  }, [handleObserver])

  return (
    <div className={className ? className : 'overflow-y'}>
      {children}
      <div
        ref={loader}
        style={{ height: '1px' }}
      />
    </div>
  )
}

export { ScrollableContainer }
