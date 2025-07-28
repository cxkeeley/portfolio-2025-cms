import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { KTCard } from '@components/KTCard'

import TeamImage from '../TeamImage'

type Props = {
  imageSrc: string
  toolbar?: ReactNode
}

const TeamThumbnailCard: FC<Props> = ({ imageSrc, toolbar }) => {
  return (
    <KTCard flush>
      <KTCard.Header className="mb-0">
        <KTCard.Title>
          <FormattedMessage id="team.label.thumbnail" />
        </KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body className="pt-0">
        <TeamImage
          caption="Thumbnail Image"
          src={imageSrc}
        />
      </KTCard.Body>
    </KTCard>
  )
}

export default TeamThumbnailCard
