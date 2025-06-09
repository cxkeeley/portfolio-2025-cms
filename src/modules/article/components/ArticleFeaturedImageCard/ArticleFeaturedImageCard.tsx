import { FC, ReactNode } from 'react'

import { KTCard } from '@components/KTCard'

import ArticleImage from '../ArticleImage'
import { EmptyContentPlaceholder } from '@components/EmptyContentPlaceholder'
import { FormattedMessage } from 'react-intl'

type Props = {
  imageSrc: string | null
  toolbar?: ReactNode
}

const ArticleFeaturedImageCard: FC<Props> = ({ imageSrc, toolbar }) => {
  return (
    <KTCard flush>
      <KTCard.Header className="mb-0">
        <KTCard.Title>Featured Image</KTCard.Title>

        {toolbar && <KTCard.Toolbar>{toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body className="pt-0">
        {imageSrc ? (
          <ArticleImage
            caption="Featured Image"
            src={imageSrc}
            width="100%"
          />
        ) : (
          <div className="text-center">
            <EmptyContentPlaceholder.Illustration />
            <EmptyContentPlaceholder.Title As="h5">
              <FormattedMessage id="article.message.empty_featured_image_placeholder" />
            </EmptyContentPlaceholder.Title>
          </div>
        )}
      </KTCard.Body>
    </KTCard>
  )
}

export default ArticleFeaturedImageCard
