import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { Avatar } from '@components/Avatar'
import { DetailLine } from '@components/DetailLine'
import EmptyPlaceholderText from '@components/EmptyPlaceholderText'
import { FormatDate } from '@components/FormatDate'
import { KTCard } from '@components/KTCard'

import TypeUtil from '@/utils/typeUtil'

type Props = {
  cardTitle: ReactNode
  cardToolbar?: ReactNode

  clientName: string
  clientImageSrc: string
  clientImageAlt: string | null
  story: string

  updatedAt?: string
  createdAt?: string
}

const ProjectReviewDetailCard: FC<Props> = ({ cardTitle, cardToolbar, ...props }) => {
  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>{cardTitle}</KTCard.Title>
        {cardToolbar && <KTCard.Toolbar>{cardToolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="project_review.label.client_name" />
          </DetailLine.Label>
          <DetailLine.Body>{props.clientName}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="project_review.label.client_image" />
          </DetailLine.Label>
          <DetailLine.Body>
            {props.clientImageSrc ? (
              <Avatar
                image={props.clientImageSrc}
                label={props.clientName}
                xs="65px"
                shape="circle"
              />
            ) : (
              <EmptyPlaceholderText />
            )}
          </DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="project_review.label.client_image_alt" />
          </DetailLine.Label>
          <DetailLine.Body>{props.clientImageAlt ? props.clientImageAlt : <EmptyPlaceholderText />}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="project_review.label.story" />
          </DetailLine.Label>
          <DetailLine.Body>{props.story}</DetailLine.Body>
        </DetailLine>

        {TypeUtil.isDefined(props.createdAt) && (
          <DetailLine>
            <DetailLine.Label>
              <FormattedMessage id="model.created_at" />
            </DetailLine.Label>
            <DetailLine.Body>
              <FormatDate
                date={props.createdAt}
                withTime={true}
              />
            </DetailLine.Body>
          </DetailLine>
        )}

        {TypeUtil.isDefined(props.updatedAt) && (
          <DetailLine>
            <DetailLine.Label>
              <FormattedMessage id="model.updated_at" />
            </DetailLine.Label>
            <DetailLine.Body>
              <FormatDate
                date={props.updatedAt}
                withTime={true}
              />
            </DetailLine.Body>
          </DetailLine>
        )}
      </KTCard.Body>
    </KTCard>
  )
}

export default ProjectReviewDetailCard
