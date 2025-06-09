import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import articleColumnHelper from '@modules/article/utils/articleColumnHelper'

type Props = {
  title: string
}

const ArticleTitleCell: FC<Props> = ({ title }) => {
  return <>{title}</>
}

const ArticleTitleColumn = articleColumnHelper.accessor((info) => info.default_title, {
  id: 'title',
  minSize: 350,
  header: () => <FormattedMessage id="article_language.label.title" />,
  cell: (info) => <ArticleTitleCell title={info.getValue()} />,
})

export default ArticleTitleCell

export { ArticleTitleColumn }
