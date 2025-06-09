import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { DetailLine } from '@components/DetailLine'
import EmptyPlaceholderText from '@components/EmptyPlaceholderText'
import { FormatDate } from '@components/FormatDate'
import { KTCard } from '@components/KTCard'

type Props = {
  title: string
  shortDescription: string
  imageAlt: string | null
  updatedAt: string
  cardTitle: ReactNode
  cardToolbar?: ReactNode
}

const LocationServiceLanguageDetailCard: FC<Props> = (props) => {
  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>{props.cardTitle}</KTCard.Title>
        {props.cardToolbar && <KTCard.Toolbar>{props.cardToolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="vocabulary.name" />
          </DetailLine.Label>
          <DetailLine.Body>{props.title}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location_service.label.short_description" />
          </DetailLine.Label>
          <DetailLine.Body>{props.shortDescription}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location_service.label.image_alt" />
          </DetailLine.Label>
          <DetailLine.Body>{props.imageAlt ?? <EmptyPlaceholderText />}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="model.updated_at" />
          </DetailLine.Label>
          <DetailLine.Body>
            <FormatDate
              date={props.updatedAt}
              withTime
            />
          </DetailLine.Body>
        </DetailLine>
      </KTCard.Body>
    </KTCard>
  )
}

export default LocationServiceLanguageDetailCard
