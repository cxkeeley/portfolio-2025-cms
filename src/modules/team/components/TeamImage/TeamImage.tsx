import { CSSProperties, FC } from 'react'

import { TEAM_IMAGE_ASPECT_RATIO } from '@modules/team/constants'

type Props = {
  src: string
  caption?: string
}

const TeamImage: FC<Props> = ({ src, caption }) => {
  const style: CSSProperties = {
    aspectRatio: TEAM_IMAGE_ASPECT_RATIO,
    width: '100%',
    height: 'auto',
  }

  return (
    <img
      src={src}
      alt={caption}
      style={style}
      className="bg-gray-200 border border-1 rounded"
    />
  )
}

export default TeamImage
