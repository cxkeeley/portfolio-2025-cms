import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'

import AdminProjectReviewsAPI from '@api/admin/projectReviewsAPI'

import { Button } from '@components/Button'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import { PermissionsControl } from '@modules/permissions'
import ProjectReviewDetailCard from '@modules/project-review/components/ProjectReviewDetailCard'
import ProjectReviewFormModal, {
  ProjectReviewFormModalShape,
} from '@modules/project-review/components/ProjectReviewFormModal'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useBoolState } from '@/hooks'

const ProjectReviewDetailPage: React.FC = () => {
  const queryClient = useQueryClient()
  const { projectId, projectReviewId } = useParams()
  const [isShowEditModal, , showEditModal, hideEditModal] = useBoolState()

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: [QUERIES.ADMIN_PROJECT_IMAGE_DETAIL, { projectId, projectReviewId }],
    queryFn: () => AdminProjectReviewsAPI.get(projectReviewId!),
    select: (response) => response.data.data.project_review,
  })

  const handleSubmitEditFormModal = async (values: ProjectReviewFormModalShape) => {
    await AdminProjectReviewsAPI.update(projectReviewId!, {
      client_image_alt: values.client_image_alt ?? null,
      client_image_file_path: values.client_image_file_path ?? null,
      client_name: values.client_name ?? '',
      story: values.story ?? '',
    })

    hideEditModal()
    refetch()
    // Reset project review list table
    queryClient.invalidateQueries([QUERIES.ADMIN_PROJECT_REVIEW_LIST])
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
            <ProjectReviewDetailCard
              clientName={data.client_name}
              clientImageAlt={data.client_image_alt}
              clientImageSrc={data.client_image_file?.link ?? ''}
              story={data.story}
              createdAt={data.created_at}
              updatedAt={data.updated_at}
              cardTitle={<FormattedMessage id="project_review.section.card_detail_title" />}
              cardToolbar={
                <PermissionsControl allow={PermissionEnum.ADMIN_PROJECT_REVIEW_UPDATE}>
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

        <ProjectReviewFormModal
          isShow={isShowEditModal}
          modalTitle={<FormattedMessage id="project_review.section.modal_edit_title" />}
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

export default ProjectReviewDetailPage
