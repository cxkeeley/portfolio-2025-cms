import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

import AdminProjectReviewsAPI, {
  PayloadAdminProjectReviewCreate,
  PayloadAdminProjectReviewFilter,
} from '@api/admin/projectReviewsAPI'

import { ID } from '@models/base'
import { ProjectReviewModel } from '@models/projectReview'

import { Avatar } from '@components/Avatar'
import { Button } from '@components/Button'
import ErrorCard from '@components/ErrorCard'
import Pagination from '@components/Pagination'
import { Table } from '@components/Table'

import { PermissionsControl } from '@modules/permissions'
import projectReviewHelper from '@modules/project-review/utils/projectReviewHelper'

import { PagePermission } from '@/constants/pagePermission'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

import ProjectReviewFormModal, {
  ProjectReviewFormModalShape,
} from '../../../project-review/components/ProjectReviewFormModal'
import ProjectContentTabBodyLoading from '../ProjectContentTabBodyLoading'

type Props = {
  projectId: ID
}

const ProjectReviewTabBody: React.FC<Props> = (props) => {
  const toast = useToast()
  const alert = useAlert()
  const intl = useIntl()
  const [isShowCreateModal, , showCreateModal, hideCreateModal] = useBoolState()
  const [page, setPage] = React.useState(1)

  const filterPayload: PayloadAdminProjectReviewFilter = {
    project_id: props.projectId,
    page: page,
    limit: 5,
  }

  const { data, isLoading, error, refetch } = useQuery({
    keepPreviousData: true,
    queryKey: [QUERIES.ADMIN_PROJECT_REVIEW_LIST, filterPayload],
    queryFn: () => AdminProjectReviewsAPI.filter(filterPayload),
    select: (r) => r.data.data,
  })

  const columns: ColumnDef<ProjectReviewModel, string>[] = [
    projectReviewHelper.display({
      id: 'client_name',
      size: 150,
      header: () => <FormattedMessage id="project_review.label.client_name" />,
      cell: ({ row }) => (
        <div className="d-flex align-items-center gap-5">
          {row.original.client_image_file && (
            <Avatar
              xs="50px"
              shape="circle"
              image={row.original.client_image_file.link}
              label={row.original.client_name}
            />
          )}
          <h6>{row.original.client_name}</h6>
        </div>
      ),
    }),
    projectReviewHelper.accessor((info) => info.story, {
      id: 'story',
      size: 300,
      header: () => <FormattedMessage id="project_review.label.story" />,
      cell: (info) => info.getValue(),
    }),
    projectReviewHelper.display({
      id: 'action',
      size: 100,
      header: () => (
        <div className="text-end">
          <FormattedMessage id="table.action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="d-flex justify-content-end gap-3">
          <PermissionsControl allow={PagePermission.ADMIN_PROJECT_REVIEW_DETAIL}>
            <NavLink to={`/admin/projects/${props.projectId}/reviews/${row.original.id}`}>
              <Button
                size="sm"
                variant="icon"
                theme="secondary"
                activeTextColor="primary"
              >
                <i className="fa-solid fa-eye" />
              </Button>
            </NavLink>
          </PermissionsControl>

          <PermissionsControl allow={PermissionEnum.ADMIN_PROJECT_REVIEW_DELETE}>
            <Button
              size="sm"
              variant="icon"
              theme="secondary"
              activeTextColor="danger"
              onClick={() => deleteProjectReview(row.original)}
            >
              <i className="fa-solid fa-trash" />
            </Button>
          </PermissionsControl>
        </div>
      ),
    }),
  ]

  const deleteProjectReview = async (item: ProjectReviewModel) => {
    try {
      const { isConfirmed } = await alert.warning({
        text: intl.formatMessage({ id: 'project_review.message.delete_confirm_prompt' }, { name: item.client_name }),
        confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
      })
      if (!isConfirmed) return

      await AdminProjectReviewsAPI.delete(item.id)

      refetch()
      toast.success(intl.formatMessage({ id: 'project_review.message.delete_success' }))
    } catch (err) {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    }
  }

  const handleSubmitCreateModal = async (values: ProjectReviewFormModalShape) => {
    const payload = FormUtil.parseValues<PayloadAdminProjectReviewCreate>({
      ...values,
      project_id: props.projectId,
    })
    await AdminProjectReviewsAPI.create(payload)

    refetch()
    hideCreateModal()

    toast.success(intl.formatMessage({ id: 'project_review.message.create_success' }))
  }

  if (data) {
    return (
      <React.Fragment>
        <div>
          <div className="mb-5">
            <PermissionsControl allow={[PermissionEnum.ADMIN_PROJECT_REVIEW_CREATE]}>
              <Button
                theme="primary"
                onClick={showCreateModal}
              >
                <i className="fa-solid fa-plus" />
                <FormattedMessage id="project_review.button.add" />
              </Button>
            </PermissionsControl>
          </div>

          <div className="border rounded overflow-hidden mb-5">
            <Table
              columns={columns}
              isLoading={isLoading}
              data={data.nodes}
              variant={['row-bordered']}
              className="mb-0"
            />
          </div>

          {data.total > 0 && (
            <div className="d-flex justify-content-end">
              <Pagination
                current={page}
                total={data.total}
                pageSize={data.limit}
                onChange={setPage}
              />
            </div>
          )}
        </div>

        <ProjectReviewFormModal
          isShow={isShowCreateModal}
          modalTitle={<FormattedMessage id="project_review.section.modal_create_title" />}
          onSubmit={handleSubmitCreateModal}
          onHide={hideCreateModal}
          onCancel={hideCreateModal}
        />
      </React.Fragment>
    )
  }

  if (isLoading) {
    return <ProjectContentTabBodyLoading />
  }

  if (error) {
    return <ErrorCard />
  }

  return null
}

export default ProjectReviewTabBody
