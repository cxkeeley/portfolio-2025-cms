import { CSSProperties, FC, PropsWithChildren } from 'react'

import { ID } from '@models/base'

type ArticleContentParagprahProps = {}

type ArticleContentListProps = {
  style: 'unordered' | 'ordered'
  items: string[]
}

type ArticleContentImageProps = {
  fileId: ID
  width: number
  height: 1 | 2 | 3 | 4 | 5 | 6
  caption?: string
}

type ArticleContentHeaderProps = {
  level: number
}

const Paragraph: FC<PropsWithChildren<ArticleContentParagprahProps>> = ({ children }) => {
  return <p className="mb-0 fs-6">{children}</p>
}

const List: FC<ArticleContentListProps> = ({ style, items }) => {
  const CustomTag = style === 'ordered' ? 'ol' : 'ul'

  return (
    <CustomTag className="fs-6 mb-0">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </CustomTag>
  )
}

const Image: FC<ArticleContentImageProps> = ({ caption, fileId, height, width }) => {
  const style: CSSProperties = {
    width: '100%',
    height: 'auto',
  }

  return (
    <img
      alt={caption}
      src={fileId}
      width={width}
      height={height}
      className="bg-gray-100 rounded"
      style={style}
    />
  )
}

const Header: FC<PropsWithChildren<ArticleContentHeaderProps>> = ({ level, children }) => {
  const CustomTag = `h${level}` as keyof JSX.IntrinsicElements

  return <CustomTag className="mb-0">{children}</CustomTag>
}

const ArticleContent = Object.assign(
  {},
  {
    Paragraph,
    List,
    Image,
    Header,
  }
)

export default ArticleContent
