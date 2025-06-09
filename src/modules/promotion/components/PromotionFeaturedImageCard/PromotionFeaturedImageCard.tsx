import { FC, ReactNode } from 'react'

import { KTCard } from '@components/KTCard'

import { Image } from '@/components/Image'
import { PROMOTION_IMAGE_THUMBNAIL_ASPECT_RATIO } from '../../constants'

type Props = {
  imageSrc?: string
  toolbar?: ReactNode
}

const PromotionFeaturedImageCard: FC<Props> = ({ imageSrc, toolbar }) => {
  return (
    <KTCard flush>
      <KTCard.Header className="mb-0">
        <KTCard.Title>Featured Image</KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body className="pt-0">
        <Image
          width="100%"
          height="auto"
          className="rounded"
          src={imageSrc}
          aspectRatio={PROMOTION_IMAGE_THUMBNAIL_ASPECT_RATIO}
        />
      </KTCard.Body>
    </KTCard>
  )
}

export default PromotionFeaturedImageCard
