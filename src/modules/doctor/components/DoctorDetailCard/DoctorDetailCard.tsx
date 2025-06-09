import { FC, ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import { Check } from '@components/Check'
import { DetailLine } from '@components/DetailLine'
import { KTCard } from '@components/KTCard'

import DoctorImage from '../DoctorImage'

type Props = {
  slug: string
  name: string
  degree: string | null
  jobTitle: string
  image: string
  location: string | null
  isActive: boolean
  startPracticeMonth: number
  startPracticeYear: number
  toolbar?: ReactNode
}

const DoctorDetailCard: FC<Props> = ({
  slug,
  name,
  degree,
  jobTitle,
  image,
  location,
  isActive,
  startPracticeMonth,
  startPracticeYear,
  toolbar,
}) => {
  const intl = useIntl()

  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="doctor.card.detail_doctor_title" />
        </KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <Row>
          <Col lg={3}>
            <DoctorImage
              src={image}
              caption={name}
            />
          </Col>

          <Col
            lg={9}
            className="ps-10"
          >
            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="vocabulary.slug" />
              </DetailLine.Label>
              <DetailLine.Body>{slug}</DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="doctor.label.name" />
              </DetailLine.Label>
              <DetailLine.Body>{name}</DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="doctor.label.degree" />
              </DetailLine.Label>
              <DetailLine.Body>{degree || '-'}</DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="doctor.label.job_title" />
              </DetailLine.Label>
              <DetailLine.Body>{jobTitle}</DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="doctor.label.location" />
              </DetailLine.Label>
              <DetailLine.Body>{location || '-'}</DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="doctor.label.active" />
              </DetailLine.Label>
              <DetailLine.Body>
                <Check check={isActive} />
              </DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="doctor.label.start_practice" />
              </DetailLine.Label>
              <DetailLine.Body>
                {`${intl.formatMessage({ id: `enum.month.${startPracticeMonth}` })} ${startPracticeYear}` || '-'}
              </DetailLine.Body>
            </DetailLine>
          </Col>
        </Row>
      </KTCard.Body>
    </KTCard>
  )
}

export default DoctorDetailCard
