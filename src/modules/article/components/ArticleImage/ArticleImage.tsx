import { CSSProperties, FC } from 'react'

import { LOCATION_IMAGE_ASPECT_RATIO } from '@modules/location/constants'

type Props = {
  src: string
  caption?: string
  width?: CSSProperties['width']
}

const LocationImage: FC<Props> = ({ src, caption, width = '100%' }) => {
  const style: CSSProperties = {
    aspectRatio: LOCATION_IMAGE_ASPECT_RATIO,
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
