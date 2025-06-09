import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { DetailLine } from '@components/DetailLine'
import { FormatDate } from '@components/FormatDate'
import { KTCard } from '@components/KTCard'

type Props = {
  publisedAt: string
  author: string
  reviewer: string | null
  category: string
  toolbar?: ReactNode
}

const ArticleDetailCard: FC<Props> = ({ author, reviewer, category, publisedAt, toolbar }) => {
  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="article.card.article_general_title" />
        </KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="article.label.author_name" />
          </DetailLine.Label>
          <DetailLine.Body>{author}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="article.label.reviewer" />
          </DetailLine.Label>
          <DetailLine.Body>{reviewer || '-'}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="model.category" />
          </DetailLine.Label>
          <DetailLine.Body>{category}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="article.label.published_at" />
          </DetailLine.Label>
          <DetailLine.Body>
            {publisedAt ? (
              <FormatDate
                date={publisedAt}
                withTime
              />
            ) : (
              '-'
            )}
          </DetailLine.Body>
        </DetailLine>
      </KTCard.Body>
    </KTCard>
  )
}

export default ArticleDetailCard
