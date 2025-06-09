import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import { PropsWithChildren } from 'react'

type Props = {
  isActive?: boolean
}

const LazyLoad: FC<PropsWithChildren<Props>> = ({ isActive, children }) => {
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    if (isActive && !show) {
      setShow(isActive)
    }
  }, [isActive, show])

  if (show) {
    return <div className={clsx('h-100 d-flex flex-column', isActive ? 'd-block' : 'd-none')}>{children}</div>
  }

  return null
}

export { LazyLoad }
