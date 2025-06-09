import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { DetailLine } from '@components/DetailLine'
import { KTCard } from '@components/KTCard'

type Props = {
  quote: string
  quoteAuthor: string | null
  toolbar?: ReactNode
}

const DoctorLanguageDetailCard: FC<Props> = ({ toolbar, quote, quoteAuthor }) => {
  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="doctor.card.doctor_language_detail_title" />
        </KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="doctor_language.label.quote" />
          </DetailLine.Label>
          <DetailLine.Body>{quote || '-'}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="doctor_language.label.quote_author" />
          </DetailLine.Label>
          <DetailLine.Body>{quoteAuthor || '-'}</DetailLine.Body>
        </DetailLine>
      </KTCard.Body>
    </KTCard>
  )
}

export default DoctorLanguageDetailCard
