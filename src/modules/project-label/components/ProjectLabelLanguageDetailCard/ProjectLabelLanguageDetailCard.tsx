import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { DetailLine } from '@components/DetailLine'
import { FormatDate } from '@components/FormatDate'
import { KTCard } from '@components/KTCard'

type Props = {
  name: string
  updatedAt: string
  cardTitle: ReactNode
  cardToolbar?: ReactNode
}

const ProjectLabelLanguageDetailCard: FC<Props> = (props) => {
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
          <DetailLine.Body>{props.name}</DetailLine.Body>
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

export default ProjectLabelLanguageDetailCard
