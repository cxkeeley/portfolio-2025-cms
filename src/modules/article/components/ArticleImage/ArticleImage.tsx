import { CSSProperties, FC } from 'react'

import { PROJECT_IMAGE_ASPECT_RATIO } from '@modules/project/constants'

type Props = {
  src: string
  caption?: string
  width?: CSSProperties['width']
}

const LocationImage: FC<Props> = ({ src, caption, width = '100%' }) => {
  const style: CSSProperties = {
    aspectRatio: PROJECT_IMAGE_ASPECT_RATIO,
    width,
  }

  return (
    <img
      src={src}
      alt={caption}
      style={style}
      className="rounded"
    />
  )
}

export default LocationImage
