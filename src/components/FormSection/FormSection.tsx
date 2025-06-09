import clsx from 'clsx'
import { FC, PropsWithChildren, ReactNode } from 'react'

type Props = {
  isEndOfChild?: boolean
  title: ReactNode
  description?: ReactNode
}

const FormSection: FC<PropsWithChildren<Props>> = ({ title, description, children, isEndOfChild }) => {
  return (
    <div
      className={clsx('row py-10', {
        'border-bottom': !isEndOfChild,
      })}
    >
      <div className="col-md-4 pe-15">
        <h3>{title}</h3>
        <p className="text-muted">{description}</p>
      </div>
      <div className="col-md-8">{children}</div>
    </div>
  )
}

export { FormSection }
