import { FC, ReactNode } from 'react'

import { EmptyContentPlaceholder } from '@components/EmptyContentPlaceholder'
import { KTCard } from '@components/KTCard'

import ArticleImage from '../LocationImage'
import { FormattedMessage } from 'react-intl'

type Props = {
  imageSrc: string | null
  cardTitle: ReactNode
  cardToolbar?: ReactNode
}

const LocationFeaturedImageCard: FC<Props> = ({ imageSrc, cardTitle, cardToolbar }) => {
  return (
    <KTCard flush>
      <KTCard.Header className="mb-0">
        <KTCard.Title>{cardTitle}</KTCard.Title>

        {cardToolbar && <KTCard.Toolbar>{cardToolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body className="pt-0">
        {imageSrc ? (
          <ArticleImage
            caption="Featured Image"
            src={imageSrc}
            width="100%"
          />
        ) : (
          <div className='text-center'>
            <EmptyContentPlaceholder.Illustration />
            <EmptyContentPlaceholder.Title As="h5">
              <FormattedMessage id="location.message.empty_featured_image_placeholder" />
            </EmptyContentPlaceholder.Title>
          </div>
        )}
      </KTCard.Body>
    </KTCard>
  )
}

export default LocationFeaturedImageCard
