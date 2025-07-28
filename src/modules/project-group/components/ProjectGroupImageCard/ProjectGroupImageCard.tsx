import { FormattedMessage } from 'react-intl'

import { EmptyContentPlaceholder } from '@components/EmptyContentPlaceholder'
import { KTCard } from '@components/KTCard'

import ProjectGroupImage from '@modules/project-group/components/ProjectGroupImage'

type Props = {
  imageSrc: string | null
  cardTitle: React.ReactNode
  toolbar?: React.ReactNode
}

const ProjectGroupImageCard: React.FC<Props> = (props) => {
  return (
    <KTCard>
      <KTCard.Header className="border-0">
        <KTCard.Title>{props.cardTitle}</KTCard.Title>
        {props.toolbar && <KTCard.Toolbar>{props.toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body className="pt-0">
        {props.imageSrc ? (
          <ProjectGroupImage
            src={props.imageSrc}
            className="rounded"
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

export default ProjectGroupImageCard
