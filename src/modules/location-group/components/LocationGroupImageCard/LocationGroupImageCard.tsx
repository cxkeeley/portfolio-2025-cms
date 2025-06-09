import { FormattedMessage } from 'react-intl'

import { EmptyContentPlaceholder } from '@components/EmptyContentPlaceholder'
import { KTCard } from '@components/KTCard'

import LocationGroupImage from '@modules/location-group/components/LocationGroupImage'

type Props = {
  imageSrc: string | null
  cardTitle: React.ReactNode
  toolbar?: React.ReactNode
}

const LocationGroupImageCard: React.FC<Props> = (props) => {
  return (
    <KTCard>
      <KTCard.Header className="border-0">
        <KTCard.Title>{props.cardTitle}</KTCard.Title>
        {props.toolbar && <KTCard.Toolbar>{props.toolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body className="pt-0">
        {props.imageSrc ? (
          <LocationGroupImage
            src={props.imageSrc}
            className="rounded"
          />
        ) : (
          <div className="text-center">
            <EmptyContentPlaceholder.Illustration />
            <EmptyContentPlaceholder.Title As="h5">
              <FormattedMessage id="location_group.message.empty_image_placeholder" />
            </EmptyContentPlaceholder.Title>
          </div>
        )}
      </KTCard.Body>
    </KTCard>
  )
}

export default LocationGroupImageCard
