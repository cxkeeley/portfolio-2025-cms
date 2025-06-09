import { Tooltip as BsTooltip } from 'bootstrap'
import React, { FC, useEffect, useRef } from 'react'

type Props = {
  text: string
  children: JSX.Element
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip: FC<Props> = ({ text, children, placement = 'right' }) => {
  const childRef = useRef(undefined as unknown as Element)

  useEffect(() => {
    const t = new BsTooltip(childRef.current, {
      title: text,
      placement: placement,
      trigger: 'hover',
    })
    return () => t.dispose()
    // eslint-disable-next-line
  }, [text])

  return React.cloneElement(children, { ref: childRef })
}
