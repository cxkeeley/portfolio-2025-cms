import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react'

export type OverlayHandle = {
  hide: () => void
  show: () => void
  toggle: () => void
}

type Props = {
  overlayClassName?: string
  onClick?: () => void
}

const OverlayComponent: ForwardRefRenderFunction<OverlayHandle, Props> = (
  { overlayClassName = 'drawer-overlay', onClick },
  ref
) => {
  const [isShow, setIsShow] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    hide: () => {
      setIsShow(false)
    },
    show: () => {
      setIsShow(true)
    },
    toggle: () => {
      setIsShow((prev) => !prev)
    },
  }))

  if (!isShow) {
    return null
  }

  return (
    <div
      onClick={onClick}
      className={overlayClassName}
    />
  )
}

const Overlay = forwardRef(OverlayComponent)

export { Overlay }
