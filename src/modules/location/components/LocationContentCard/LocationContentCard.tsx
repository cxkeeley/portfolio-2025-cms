import clsx from 'clsx'
import React from 'react'
import Tab from 'react-bootstrap/Tab'
import { FormattedMessage } from 'react-intl'

import { ID } from '@models/base'

import { Button } from '@components/Button'
import { KTCard } from '@components/KTCard'

import { usePermissions } from '@modules/permissions/core/PermissionsProvider'

import { PermissionEnum } from '@/constants/permission'

import LocationImagesTabBody from '../LocationImagesTabBody'
import LocationReviewsTabBody from '../LocationReviewsTabBody'
import LocationServicesTabBody from '../LocationServicesTabBody'

type Props = {
  locationId: ID
}

enum LocationContentTabEnum {
  IMAGES = 'images',
  REVIEWS = 'reviews',
  SERVICES = 'services',
}

type ContentTabType = {
  key: LocationContentTabEnum
  permissions: PermissionEnum[]
  content: (props: { locationId: ID }) => React.ReactNode
}

const contentTabs: ContentTabType[] = [
  {
    key: LocationContentTabEnum.IMAGES,
    content: (props) => <LocationImagesTabBody locationId={props.locationId} />,
    permissions: [PermissionEnum.ADMIN_LOCATION_IMAGE_LIST],
  },
  {
    key: LocationContentTabEnum.SERVICES,
    content: (props) => <LocationServicesTabBody locationId={props.locationId} />,
    permissions: [PermissionEnum.ADMIN_LOCATION_HAS_SERVICE_LIST],
  },
  {
    key: LocationContentTabEnum.REVIEWS,
    content: (props) => <LocationReviewsTabBody locationId={props.locationId} />,
    permissions: [PermissionEnum.ADMIN_LOCATION_REVIEW_LIST],
  },
]

const defaultActiveKey = LocationContentTabEnum.IMAGES

const LocationContentCard: React.FC<Props> = (props) => {
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
          <FormattedMessage id="location.section.card_content_title" />
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
                <FormattedMessage id={`location.button.${tab.key}`} />
              </Button>
            ))}
          </div>

          <Tab.Content className="py-5">
            {filteredContentTabs.map((tab) => (
              <Tab.Pane
                key={tab.key}
                eventKey={tab.key}
              >
                {tab.content({ locationId: props.locationId })}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </KTCard.Body>
    </KTCard>
  )
}

export default LocationContentCard
