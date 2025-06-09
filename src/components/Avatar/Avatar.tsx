import clsx from 'clsx'
import { FC, useState } from 'react'

import { getInitial } from './_helpers'

type SymbolSize =
  | '20px'
  | '25px'
  | '30px'
  | '35px'
  | '40px'
  | '45px'
  | '50px'
  | '55px'
  | '60px'
  | '65px'
  | '70px'
  | '75px'
  | '90px'
  | '100px'
  | '125px'
  | '150px'
  | '160px'
  | '175px'
  | '200px'

export type AvatarProps = {
  xs?: SymbolSize
  sm?: SymbolSize
  md?: SymbolSize
  lg?: SymbolSize
  xl?: SymbolSize
  xxl?: SymbolSize
  shape?: 'square' | 'circle'
  image?: string
  label?: string
  labelClassName?: string
}

const Avatar: FC<AvatarProps> = ({ xs, sm, md, lg, xl, xxl, image, label = '?', labelClassName, shape }) => {
  const [error, setError] = useState<boolean>(false)

  const initial = getInitial(label)

  const className = clsx('symbol bg-gray-200', {
    [`symbol-${xs}`]: xs,
    [`symbol-sm-${sm}`]: sm,
    [`symbol-md-${md}`]: md,
    [`symbol-lg-${lg}`]: lg,
    [`symbol-xl-${xl}`]: xl,
    [`symbol-xxl-${xxl}`]: xxl,
    [`symbol-${shape}`]: shape,
  })

  if (image && !error) {
    return (
      <div className={className}>
        <img
          src={image}
          alt={label}
          style={{ objectFit: 'cover' }}
          onError={() => setError(true)}
        />
      </div>
    )
  }
  return (
    <div className={className}>
      <div className={clsx('symbol-label fs-2 fw-semibold', labelClassName)}>{initial}</div>
    </div>
  )
}

export default Avatar
