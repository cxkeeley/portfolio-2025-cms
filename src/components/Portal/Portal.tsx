import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  className?: string
  to?: string
}

const Portal: FC<PropsWithChildren<Props>> = ({ to, children, className = '' }) => {
  const container = useRef(document.createElement('div')).current

  useEffect(() => {
    if (className) {
      container.classList.add(className)
    }

    const destination = to ? document.querySelector(to) : document.body
    destination?.appendChild(container)

    return () => {
      destination?.removeChild(container)
    }
  }, [className, container, to])

  if (container) {
    return createPortal(children, container)
  }

  return null
}

export { Portal }
