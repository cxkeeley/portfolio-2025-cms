import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { DetailLine } from '@components/DetailLine'
import { FormatDate } from '@components/FormatDate'
import { KTCard } from '@components/KTCard'

type Props = {
  cardTitle: ReactNode
  cardToolbar?: ReactNode

  shortName: string
  name: string
  address: string
  description: string
  slug: string
  updatedAt: string
}

const LocationLanguageDetailCard: FC<Props> = ({ cardTitle, cardToolbar, ...props }) => {
  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>{cardTitle}</KTCard.Title>
        {cardToolbar && <KTCard.Toolbar>{cardToolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="vocabulary.slug" />
          </DetailLine.Label>
          <DetailLine.Body>{props.slug}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location.label.short_name" />
          </DetailLine.Label>
          <DetailLine.Body>{props.shortName}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location.label.name" />
          </DetailLine.Label>
          <DetailLine.Body>{props.name}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location.label.description" />
          </DetailLine.Label>
          <DetailLine.Body>{props.description}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location.label.address" />
          </DetailLine.Label>
          <DetailLine.Body>{props.address}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="model.updated_at" />
          </DetailLine.Label>
          <DetailLine.Body>
            {props.updatedAt ? (
              <FormatDate
                date={props.updatedAt}
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

export default LocationLanguageDetailCard
