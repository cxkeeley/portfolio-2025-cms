import React from 'react'

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const LocationGroupImage: React.FC<Props> = ({ style, alt, ...props }) => {
  const defaultstyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    aspectRatio: '2/1',
  }

  return (
    <img
      style={{ ...defaultstyle, ...style }}
      alt={alt}
      {...props}
    />
  )
}

export default LocationGroupImage
