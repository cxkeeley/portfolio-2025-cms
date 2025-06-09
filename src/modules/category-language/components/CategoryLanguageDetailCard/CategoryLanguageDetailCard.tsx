import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import CategoryLanguageModel from '@models/categoryLanguage'

import { DetailLine } from '@components/DetailLine'
import { KTCard } from '@components/KTCard'
import { DateCell } from '@components/Table/Cell/DateCell'

type CategoryLanguageDetailCardProps = {
  categoryLanguage: CategoryLanguageModel
  toolbar?: ReactNode
}

const CategoryLanguageDetailCard: FC<CategoryLanguageDetailCardProps> = ({ categoryLanguage, toolbar }) => {
  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="category_language.card.detail_title" />
        </KTCard.Title>
        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>
      <KTCard.Body>
        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="category_language.label.name" />
          </DetailLine.Label>
          <DetailLine.Body>{categoryLanguage.name}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="category_language.label.slug" />
          </DetailLine.Label>
          <DetailLine.Body>{categoryLanguage.slug}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="model.updated_at" />
          </DetailLine.Label>
          <DetailLine.Body>
            <DateCell
              date={categoryLanguage.updated_at}
              withTime
            />
          </DetailLine.Body>
        </DetailLine>
      </KTCard.Body>
    </KTCard>
  )
}

export type { CategoryLanguageDetailCardProps }

export default CategoryLanguageDetailCard
