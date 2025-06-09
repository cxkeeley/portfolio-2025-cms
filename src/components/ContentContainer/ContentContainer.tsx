import clsx from 'clsx'
import { FC, PropsWithChildren } from 'react'

import { useLayout } from '@/layouts/core'

type Props = {}

const ContentContainer: FC<PropsWithChildren<Props>> = ({ children }) => {
  const { classes } = useLayout()

  return (
    <div
      id="kt_content_container"
      className={clsx(classes.contentContainer.join(' '))}
    >
      {children}
    </div>
  )
}

export { ContentContainer }
