import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import EmptyPlaceholderText from '@components/EmptyPlaceholderText'

import articleColumnHelper from '@modules/article/utils/articleColumnHelper'

import ArticleImage from '../ArticleImage/ArticleImage'

type Props = {
  src: string
  caption: string
}

const ArticleImageCell: FC<Props> = ({ src, caption }) => {
  return (
    <ArticleImage
      src={src}
      caption={caption}
      width={'100%'}
    />
  )
}

const ArticleImageColumn = articleColumnHelper.display({
  id: 'image',
  size: 120,
  header: () => <FormattedMessage id="article_language.label.image" />,
  cell: ({ row }) => (
    <div className="pe-5">
      {row.original.image_file ? (
        <ArticleImageCell
          src={row.original.image_file.link}
          caption={row.original.image_file.name}
        />
      ) : (
        <EmptyPlaceholderText />
      )}
    </div>
  ),
})

export default ArticleImageCell

export { ArticleImageColumn }
