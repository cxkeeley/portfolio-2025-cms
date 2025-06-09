import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import articleColumnHelper from '@modules/article/utils/articleColumnHelper'

type Props = {
  name: string
}

const ArticleAuthorCell: FC<Props> = ({ name }) => {
  return <>{name}</>
}

const ArticleAuthorColumn = articleColumnHelper.accessor((info) => info.author_name, {
  id: 'author',
  size: 150,
  header: () => <FormattedMessage id="article.label.author_name" />,
  cell: (info) => <ArticleAuthorCell name={info.getValue()} />,
})

export default ArticleAuthorCell

export { ArticleAuthorColumn }
