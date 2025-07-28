import clsx from 'clsx'
import React from 'react'
import Tab from 'react-bootstrap/Tab'
import { FormattedMessage } from 'react-intl'

import { ID } from '@models/base'

import { Button } from '@components/Button'
import { KTCard } from '@components/KTCard'

import { usePermissions } from '@modules/permissions/core/PermissionsProvider'

import { PermissionEnum } from '@/constants/permission'

import ProjectImagesTabBody from '../ProjectImagesTabBody'
import ProjectReviewsTabBody from '../ProjectReviewsTabBody'
import ProjectServicesTabBody from '../ProjectServicesTabBody'

type Props = {
  projectId: ID
}

enum ProjectContentTabEnum {
  IMAGES = 'images',
  REVIEWS = 'reviews',
  SERVICES = 'services',
}

type ContentTabType = {
  key: ProjectContentTabEnum
  permissions: PermissionEnum[]
  content: (props: { projectId: ID }) => React.ReactNode
}

const contentTabs: ContentTabType[] = [
  {
    key: ProjectContentTabEnum.IMAGES,
    content: (props) => <ProjectImagesTabBody projectId={props.projectId} />,
    permissions: [PermissionEnum.ADMIN_PROJECT_IMAGE_LIST],
  },
  {
    key: ProjectContentTabEnum.SERVICES,
    content: (props) => <ProjectServicesTabBody projectId={props.projectId} />,
    permissions: [PermissionEnum.ADMIN_PROJECT_HAS_SERVICE_LIST],
  },
  {
    key: ProjectContentTabEnum.REVIEWS,
    content: (props) => <ProjectReviewsTabBody projectId={props.projectId} />,
    permissions: [PermissionEnum.ADMIN_PROJECT_REVIEW_LIST],
  },
]

const defaultActiveKey = ProjectContentTabEnum.IMAGES

const ProjectContentCard: React.FC<Props> = (props) => {
  const [activeKey, setActiveKey] = React.useState<string>(defaultActiveKey)
  const { hasPermissions } = usePermissions()

  const getTabBtnClass = (key: string) => {
    return clsx('btn rounded-pill', {
      'btn-outline btn-outline-primary border-primary': activeKey === key,
    })
  }

  const filteredContentTabs = React.useMemo(() => {
    return contentTabs.filter((tab) => {
      return tab.permissions.some((permission) => hasPermissions([permission]))
    })
  }, [hasPermissions])

  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="project.section.card_content_title" />
        </KTCard.Title>
      </KTCard.Header>

      <KTCard.Body>
        <Tab.Container
          mountOnEnter={true}
          activeKey={activeKey}
          onSelect={(nextKey) => setActiveKey(nextKey ?? defaultActiveKey)}
        >
          <div className="d-flex flex-wrap border-bottom pb-2">
            {filteredContentTabs.map((tab) => (
              <Button
                key={tab.key}
                className={getTabBtnClass(tab.key)}
                onClick={() => setActiveKey(tab.key)}
              >
                <FormattedMessage id={`project.button.${tab.key}`} />
              </Button>
            ))}
          </div>

          <Tab.Content className="py-5">
            {filteredContentTabs.map((tab) => (
              <Tab.Pane
                key={tab.key}
                eventKey={tab.key}
              >
                {tab.content({ projectId: props.projectId })}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </KTCard.Body>
    </KTCard>
  )
}

export default ProjectContentCard
