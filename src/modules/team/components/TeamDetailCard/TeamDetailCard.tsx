import { FC, ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import { Check } from '@components/Check'
import { DetailLine } from '@components/DetailLine'
import { KTCard } from '@components/KTCard'

import TeamImage from '../TeamImage'

type Props = {
  slug: string
  name: string
  degree: string | null
  jobTitle: string
  image: string
  project: string | null
  isActive: boolean
  startPracticeMonth: number
  startPracticeYear: number
  toolbar?: ReactNode
}

const TeamDetailCard: FC<Props> = ({
  slug,
  name,
  degree,
  jobTitle,
  image,
  project,
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
          <FormattedMessage id="team.card.detail_team_title" />
        </KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <Row>
          <Col lg={3}>
            <TeamImage
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
                <FormattedMessage id="team.label.name" />
              </DetailLine.Label>
              <DetailLine.Body>{name}</DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="team.label.degree" />
              </DetailLine.Label>
              <DetailLine.Body>{degree || '-'}</DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="team.label.job_title" />
              </DetailLine.Label>
              <DetailLine.Body>{jobTitle}</DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="team.label.project" />
              </DetailLine.Label>
              <DetailLine.Body>{project || '-'}</DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="team.label.active" />
              </DetailLine.Label>
              <DetailLine.Body>
                <Check check={isActive} />
              </DetailLine.Body>
            </DetailLine>

            <DetailLine>
              <DetailLine.Label>
                <FormattedMessage id="team.label.start_practice" />
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

export default TeamDetailCard
