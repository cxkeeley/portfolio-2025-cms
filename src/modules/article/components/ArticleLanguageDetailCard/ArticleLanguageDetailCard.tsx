import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { DetailLine } from '@components/DetailLine'
import { KTCard } from '@components/KTCard'

type Props = {
  title: string
  slug: string
  imageCaption: string | null
  lead: string | null
  reference: string | null
  toolbar?: ReactNode
}

const ArticleLanguageDetailCard: FC<Props> = ({ title, slug, imageCaption, lead, reference, toolbar }) => {
  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="article.card.article_detail_title" />
        </KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="article_language.label.title" />
          </DetailLine.Label>
          <DetailLine.Body>{title}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="article_language.label.slug" />
          </DetailLine.Label>
          <DetailLine.Body>{slug}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="article_language.label.image_caption" />
          </DetailLine.Label>
          <DetailLine.Body>{imageCaption || '-'}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="article_language.label.lead" />
          </DetailLine.Label>
          <DetailLine.Body>{lead || '-'}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="article_language.label.reference" />
          </DetailLine.Label>
          <DetailLine.Body style={{ whiteSpace: 'pre-wrap' }}>{reference || '-'}</DetailLine.Body>
        </DetailLine>
      </KTCard.Body>
    </KTCard>
  )
}

export default ArticleLanguageDetailCard
