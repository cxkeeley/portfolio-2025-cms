import { FC, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { DetailLine } from '@components/DetailLine'
import EmptyPlaceholderText from '@components/EmptyPlaceholderText'
import { FormatDate } from '@components/FormatDate'
import { KTBadge } from '@components/KTBadge'
import { KTCard } from '@components/KTCard'
import Map from '@components/Map'
import MapPinpoint from '@components/MapPinpoint'

import TypeUtil from '@/utils/typeUtil'

type Props = {
  cardTitle: ReactNode
  cardToolbar?: ReactNode
  address: string
  phoneNumber: string
  locationGroupName: string
  locationLabel: string
  isComingSoon: boolean
  latitude: number | null
  longitude: number | null
  updatedAt?: string
}

const LocationDetailCard: FC<Props> = ({ cardTitle, cardToolbar, ...props }) => {
  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>{cardTitle}</KTCard.Title>
        {cardToolbar && <KTCard.Toolbar>{cardToolbar}</KTCard.Toolbar>}
      </KTCard.Header>

      <KTCard.Body>
        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location.label.status" />
          </DetailLine.Label>
          <DetailLine.Body>
            {props.isComingSoon ? (
              <KTBadge
                variant="light-warning"
                size="lg"
              >
                <FormattedMessage id="location.badge.coming_soon" />
              </KTBadge>
            ) : (
              <KTBadge
                variant="light-success"
                size="lg"
              >
                <FormattedMessage id="location.badge.active" />
              </KTBadge>
            )}
          </DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location.label.group" />
          </DetailLine.Label>
          <DetailLine.Body>{props.locationGroupName || <EmptyPlaceholderText />}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location.label.label" />
          </DetailLine.Label>
          <DetailLine.Body>{props.locationLabel || <EmptyPlaceholderText />}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location.label.phone_number" />
          </DetailLine.Label>
          <DetailLine.Body>{props.phoneNumber}</DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="location.label.address" />
          </DetailLine.Label>
          <DetailLine.Body>
            {props.address}

            {TypeUtil.isDefined(props.latitude) && TypeUtil.isDefined(props.longitude) && (
              <Map
                width="100%"
                height="120px"
                className="rounded border mt-2"
                latitude={props.latitude}
                longitude={props.longitude}
                options={{
                  scrollWheelZoom: false,
                  zoomControl: false,
                  dragging: false,
                }}
              >
                <MapPinpoint />
              </Map>
            )}
          </DetailLine.Body>
        </DetailLine>

        <DetailLine>
          <DetailLine.Label>
            <FormattedMessage id="model.updated_at" />
          </DetailLine.Label>
          <DetailLine.Body>
            {props.updatedAt ? (
              <FormatDate
                date={props.updatedAt}
                withTime
              />
            ) : (
              '-'
            )}
          </DetailLine.Body>
        </DetailLine>
      </KTCard.Body>
    </KTCard>
  )
}

export default LocationDetailCard
