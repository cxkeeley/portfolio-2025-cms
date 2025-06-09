import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { DetailLine } from '@components/DetailLine'
import { KTCard } from '@components/KTCard'

type Props = {
  whatsappText: string | null
  title?: ReactNode
  toolbar?: ReactNode
}

const PromotionDetailCard: FC<Props> = ({ whatsappText, title, toolbar }) => {
  return (
    <KTCard>
      <KTCard.Header>
        {title && <KTCard.Title>{title}</KTCard.Title>}

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="promotion.label.whatsapp_text" />
          </DetailLine.Label>
          <DetailLine.Body>{whatsappText ?? '-'}</DetailLine.Body>
        </DetailLine>
      </KTCard.Body>
    </KTCard>
  )
}

export default PromotionDetailCard
