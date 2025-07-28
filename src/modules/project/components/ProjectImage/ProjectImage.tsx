import { CSSProperties, FC } from 'react'

type Props = {
  src: string
  caption?: string
  width?: CSSProperties['width']
}

const ArticleImage: FC<Props> = ({ src, caption, width }) => {
  const style: CSSProperties = {
    aspectRatio: 3 / 2,
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

export default ArticleImage
