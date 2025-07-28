import { FormattedMessage } from 'react-intl'

import { EmptyContentPlaceholder } from '@components/EmptyContentPlaceholder'
import { Image } from '@components/Image'
import { KTCard } from '@components/KTCard'

type Props = {
  imageSrc: string | null
  cardTitle: React.ReactNode
  toolbar?: React.ReactNode
}

const ProjectLabelImageCard: React.FC<Props> = (props) => {
  return (
    <KTCard>
      <KTCard.Header className="border-0">
        <KTCard.Title>{props.cardTitle}</KTCard.Title>
        {props.toolbar && <KTCard.Toolbar>{props.toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body className="pt-0">
        {props.imageSrc ? (
          <Image
            src={props.imageSrc}
            className="rounded"
            aspectRatio={1}
          />
        ) : (
          <div className="text-center">
            <EmptyContentPlaceholder.Illustration />
            <EmptyContentPlaceholder.Title As="h5">
              <FormattedMessage id="project_service.message.empty_image_placeholder" />
            </EmptyContentPlaceholder.Title>
          </div>
        )}
      </KTCard.Body>
    </KTCard>
  )
}

export default ProjectLabelImageCard
