import { FormattedMessage } from 'react-intl'

import { EmptyContentPlaceholder } from '@components/EmptyContentPlaceholder'
import { KTCard } from '@components/KTCard'

import ProjectImage from '../ProjectImage/ProjectImage'

type Props = {
  imageSrc: string | null
  cardTitle: React.ReactNode
  toolbar?: React.ReactNode
}

const ProjectImageDetailCard: React.FC<Props> = (props) => {
  return (
    <KTCard>
      <KTCard.Header className="border-0">
        <KTCard.Title>{props.cardTitle}</KTCard.Title>
        {props.toolbar && <KTCard.Toolbar>{props.toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body className="pt-0">
        {props.imageSrc ? (
          <ProjectImage
            src={props.imageSrc}
            width="100%"
          />
        ) : (
          <div className="text-center">
            <EmptyContentPlaceholder.Illustration />
            <EmptyContentPlaceholder.Title As="h5">
              <FormattedMessage id="project_group.message.empty_image_placeholder" />
            </EmptyContentPlaceholder.Title>
          </div>
        )}
      </KTCard.Body>
    </KTCard>
  )
}

export default ProjectImageDetailCard
