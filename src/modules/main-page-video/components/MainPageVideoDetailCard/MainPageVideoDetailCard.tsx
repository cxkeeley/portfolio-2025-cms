import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { Check } from '@components/Check'
import { DetailLine } from '@components/DetailLine'
import { KTCard } from '@components/KTCard'
import { DateCell } from '@components/Table/Cell/DateCell'

type Props = {
  title: string
  uri: string
  isActive: boolean
  updatedAt?: string
  thumbnailImageSrc: string
  toolbar?: ReactNode
}

const MainPageVideoDetailCard: FC<Props> = ({ toolbar, ...props }) => {
  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="main_page_video.card.main_page_video_detail" />
        </KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="main_page_video.label.title" />
          </DetailLine.Label>
          <DetailLine.Body>{props.title}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="main_page_video.label.uri" />
          </DetailLine.Label>
          <DetailLine.Body>
            <a
              href={props.uri}
              target="_blank"
              rel="noreferrer"
            >
              {props.uri}
            </a>
          </DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="model.updated_at" />
          </DetailLine.Label>
          <DetailLine.Body>
            <DateCell
              date={props.updatedAt}
              withTime
            />
          </DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="main_page_video.label.active" />
          </DetailLine.Label>
          <DetailLine.Body>
            <Check check={props.isActive} />
          </DetailLine.Body>
        </DetailLine>
      </KTCard.Body>
    </KTCard>
  )
}

export default MainPageVideoDetailCard
