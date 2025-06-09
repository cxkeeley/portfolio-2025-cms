import { createPopper, Instance, Placement } from '@popperjs/core'
import clsx from 'clsx'
import { CSSProperties, FC, PropsWithChildren, RefObject, useEffect, useRef, useState } from 'react'

import useOuterClick from '@/hooks/useOuterClick'

type Props = {
  isShow: boolean
  placement: Placement
  targetRef: RefObject<HTMLElement>
  width?: number
  height?: number
  onOuterClick?: () => void
}

const MenuDropdown: FC<PropsWithChildren<Props>> = ({
  children,
  isShow,
  placement,
  targetRef,
  height,
  width = 300,
  onOuterClick,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [popper, setPopper] = useState<Instance>()
  const styles = popper?.state.styles.popper as CSSProperties | undefined
  const attributes = popper?.state.attributes.popper as Record<string, string> | undefined

  useOuterClick(ref, (e) => {
    if (onOuterClick && !targetRef.current?.contains(e.target as Element)) {
      onOuterClick()
    }
  })

  useEffect(() => {
    if (!popper) {
      const instance = createPopper(targetRef.current as unknown as Element, ref.current as HTMLDivElement, {
        placement,
        strategy: 'fixed',
      })
      setPopper(instance)
    }

    if (popper && isShow) {
      popper.update()
    }
  }, [targetRef, isShow, popper, ref, placement])

  return (
    <div
      ref={ref}
      style={{ width, height, ...styles }}
      className={clsx('menu menu-sub menu-sub-dropdown', {
        show: isShow,
      })}
      {...attributes}
    >
      {children}
    </div>
  )
}

export { MenuDropdown }
