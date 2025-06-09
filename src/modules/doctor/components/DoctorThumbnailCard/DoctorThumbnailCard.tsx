import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { KTCard } from '@components/KTCard'

import DoctorImage from '../DoctorImage'

type Props = {
  imageSrc: string
  toolbar?: ReactNode
}

const DoctorThumbnailCard: FC<Props> = ({ imageSrc, toolbar }) => {
  return (
    <KTCard flush>
      <KTCard.Header className="mb-0">
        <KTCard.Title>
          <FormattedMessage id="doctor.label.thumbnail" />
        </KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body className="pt-0">
        <DoctorImage
          caption="Thumbnail Image"
          src={imageSrc}
        />
      </KTCard.Body>
    </KTCard>
  )
}

export default DoctorThumbnailCard
