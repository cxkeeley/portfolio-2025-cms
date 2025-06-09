import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { Image } from '@components/Image'
import { KTCard } from '@components/KTCard'

import { MAIN_PAGE_VIDEO_THUMBNAIL_ASPECT_RATIO } from '@modules/main-page-video/constants'

type Props = {
  thumbnailImageSrc: string
  toolbar?: ReactNode
}

const MainPageVideoThumbnailCard: FC<Props> = ({ thumbnailImageSrc, toolbar }) => {
  return (
    <KTCard flush>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="main_page_video.label.thumbnail" />
        </KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>
      <KTCard.Body className="pt-0">
        <Image
          width="100%"
          height="auto"
          aspectRatio={MAIN_PAGE_VIDEO_THUMBNAIL_ASPECT_RATIO}
          className="rounded"
          src={thumbnailImageSrc}
        />
      </KTCard.Body>
    </KTCard>
  )
}

export default MainPageVideoThumbnailCard
