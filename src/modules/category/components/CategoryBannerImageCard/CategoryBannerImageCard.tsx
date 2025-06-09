import { FC, ReactNode } from 'react'
import { Ratio } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { Image } from '@components/Image'
import { KTCard } from '@components/KTCard'

type CategoryBannerImageProps = {
  bannerImageSrc?: string
  toolbar?: ReactNode
}

const CategoryBannerImageCard: FC<CategoryBannerImageProps> = ({ bannerImageSrc, toolbar }) => {
  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="category.card.banner_image_title" />
        </KTCard.Title>
        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>
      <KTCard.Body>
        <Ratio aspectRatio={5 / 16}>
          <Image
            width="100%"
            height="100%"
            className="rounded"
            src={bannerImageSrc}
          />
        </Ratio>
      </KTCard.Body>
    </KTCard>
  )
}

export type { CategoryBannerImageProps }

export default CategoryBannerImageCard
