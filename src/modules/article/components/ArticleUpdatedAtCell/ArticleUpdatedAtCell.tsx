import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import { FormatDate } from '@components/FormatDate'

import articleColumnHelper from '@modules/article/utils/articleColumnHelper'

type Props = {
  date: string
}

const ArticleUpdatedAtCell: FC<Props> = ({ date }) => {
  return (
    <FormatDate
      date={date}
      withTime
    />
  )
}

const ArticleUpdatedAtColumn = articleColumnHelper.accessor((info) => info.updated_at, {
  id: 'updated_at',
  size: 150,
  header: () => <FormattedMessage id="table.updated_at" />,
  cell: (info) => <ArticleUpdatedAtCell date={info.getValue()} />,
})

export default ArticleUpdatedAtCell

export { ArticleUpdatedAtColumn }
