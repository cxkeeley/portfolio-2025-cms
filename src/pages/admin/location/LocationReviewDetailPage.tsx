import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'

import AdminLocationReviewsAPI from '@api/admin/projectReviewsAPI'

import { Button } from '@components/Button'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import LocationReviewDetailCard from '@modules/location-review/components/LocationReviewDetailCard'
import LocationReviewFormModal, {
  LocationReviewFormModalShape,
} from '@modules/location-review/components/LocationReviewFormModal'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useBoolState } from '@/hooks'

const LocationReviewDetailPage: React.FC = () => {
  const queryClient = useQueryClient()
  const { locationId, locationReviewId } = useParams()
  const [isShowEditModal, , showEditModal, hideEditModal] = useBoolState()

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: [QUERIES.ADMIN_LOCATION_IMAGE_DETAIL, { locationId, locationReviewId }],
    queryFn: () => AdminLocationReviewsAPI.get(locationReviewId!),
    select: (response) => response.data.data.location_review,
  })

  const handleSubmitEditFormModal = async (values: LocationReviewFormModalShape) => {
    await AdminLocationReviewsAPI.update(locationReviewId!, {
      client_image_alt: values.client_image_alt ?? null,
      client_image_file_path: values.client_image_file_path ?? null,
      client_name: values.client_name ?? '',
      story: values.story ?? '',
    })

    hideEditModal()
    refetch()
    // Reset location review list table
    queryClient.invalidateQueries([QUERIES.ADMIN_LOCATION_REVIEW_LIST])
  }

  if (data) {
    return (
      <React.Fragment>
        <Row>
          <Col
            xs={12}
            md={6}
            lg={7}
            xl={8}
          >
            <LocationReviewDetailCard
              clientName={data.client_name}
              clientImageAlt={data.client_image_alt}
              clientImageSrc={data.client_image_file?.link ?? ''}
              story={data.story}
              createdAt={data.created_at}
              updatedAt={data.updated_at}
              cardTitle={<FormattedMessage id="location_review.section.card_detail_title" />}
              cardToolbar={
                <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_REVIEW_UPDATE}>
                  <Button
                    theme="primary"
                    onClick={showEditModal}
                  >
                    <i className="fa-solid fa-pen" />
                    <FormattedMessage id="vocabulary.edit" />
                  </Button>
                </PermissionsControl>
              }
            />
          </Col>
        </Row>

        <LocationReviewFormModal
          isShow={isShowEditModal}
          modalTitle={<FormattedMessage id="location_review.section.modal_edit_title" />}
          initialImageSrc={data.client_image_file?.link}
          initialValues={{
            client_image_alt: data.client_image_alt,
            client_name: data.client_name,
            story: data.story,
          }}
          onSubmit={handleSubmitEditFormModal}
          onHide={hideEditModal}
          onCancel={hideEditModal}
        />
      </React.Fragment>
    )
  }

  if (isFetching) {
    return <FloatLoadingIndicator />
  }

  if (isError) {
    return <ErrorCard />
  }

  return null
}

export default LocationReviewDetailPage
