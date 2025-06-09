import clsx from 'clsx'
import { FC } from 'react'

type Props = {
  type?: 'border' | 'grow'
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
}

const Spinner: FC<Props> = ({ type = 'border', variant }) => {
  return (
    <div
      className={clsx(`spinner-${type}`, {
        [`text-${variant}`]: variant,
      })}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

export { Spinner }
