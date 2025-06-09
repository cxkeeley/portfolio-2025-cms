import clsx from 'clsx'
import { CSSProperties, FC, useState } from 'react'
import Placeholder from 'react-bootstrap/Placeholder'

import PathUtil from '@/utils/pathUtil'

type Props = {
  src?: string
  alt?: string
  className?: string
  width?: string | number
  height?: string | number
  isLoading?: boolean
  animation?: 'wave' | 'glow'
  aspectRatio?: number
}

const Image: FC<Props> = ({ src, alt, className, width, height, isLoading, animation, aspectRatio }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const style: CSSProperties = {
    width,
    height,
    aspectRatio,
  }

  const placeholderStyle: CSSProperties = {
    ...style,
    backgroundImage: `url("${PathUtil.toAbsoluteURL('/media/logos/logo-placeholder.png')}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '60% auto',
    backgroundPosition: 'center center',
  }

  if (isLoading) {
    return (
      <Placeholder
        as="div"
        animation={animation}
        className={clsx(
          'd-flex justify-content-center align-items-center fw-medium fs-6',
          className,
          isLoading ? '' : 'text-muted'
        )}
        style={style}
      />
    )
  }

  return (
    <div
      className={clsx('bg-gray-300', className)}
      style={isLoaded ? style : placeholderStyle}
    >
      <img
        className="w-100 h-100 rounded"
        src={src}
        alt={alt}
        style={{ objectFit: 'contain' }}
        onLoad={(e) => {
          setIsLoaded(true)
          e.currentTarget.style.display = 'block'
        }}
        onError={(e) => {
          setIsLoaded(false)
          e.currentTarget.style.display = 'none'
        }}
      />
    </div>
  )
}

export { Image }
