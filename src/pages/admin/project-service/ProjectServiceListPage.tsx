import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

import AdminProjectServicesAPI from '@api/admin/projectServiceAPI'

import { ProjectServiceModel } from '@models/projectService'

import { Button } from '@components/Button'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { KTCard } from '@components/KTCard'
import Pagination from '@components/Pagination'
import { Table } from '@components/Table'

import { PermissionsControl } from '@modules/permissions'
import projectServiceColumns, {
  projectServiceColumnHelper,
} from '@modules/project-service/utils/projectServiceColumnHelper'

import { PagePermission } from '@/constants/pagePermission'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

const ProjectServiceListPage: FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()

  const { query, page, setPage } = useRequestState<ProjectServiceModel>()

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [QUERIES.ADMIN_PROJECT_SERVICE_LIST, query],
    queryFn: () => AdminProjectServicesAPI.filter(query),
    select: (r) => r.data.data,
  })

  const deleteProjectService = useCallback(
    async (item: ProjectServiceModel) => {
      try {
        const { isConfirmed } = await alert.warning({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: item.default_title }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })

        if (!isConfirmed) return

        await AdminProjectServicesAPI.delete(item.id)
        refetch()
        toast.success(intl.formatMessage({ id: 'project_service.message.delete_project_success' }))
      } catch (err) {
        if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
          alert.error({ text: err.response.data.message })
        } else {
          alert.error({ text: String(err) })
        }
      }
    },
    [alert, intl, refetch, toast]
  )

  const columns = useMemo(
    () => [
      projectServiceColumns.image,
      projectServiceColumns.title,
      projectServiceColumns.updatedAt,
      projectServiceColumnHelper.display({
        id: 'action',
        size: 100,
        header: () => (
          <div className="text-end">
            <FormattedMessage id="table.action" />
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="d-flex justify-content-end gap-3">
              <PermissionsControl allow={PagePermission.ADMIN_PROJECT_SERVICE_DETAIL}>
                <NavLink to={`/admin/project-services/${row.original.id}`}>
                  <Button
                    variant="icon"
                    theme="secondary"
                  >
                    <i className="fa-solid fa-eye" />
                  </Button>
                </NavLink>
              </PermissionsControl>

              <PermissionsControl allow={PermissionEnum.ADMIN_PROJECT_SERVICE_DELETE}>
                <Button
                  variant="icon"
                  theme="secondary"
                  onClick={() => deleteProjectService(row.original)}
                >
                  <i className="fa-solid fa-trash" />
                </Button>
              </PermissionsControl>
            </div>
          )
        },
      }),
    ],
    [deleteProjectService]
  )

  if (isLoading) {
    return <FloatLoadingIndicator />
  }

  if (error || !data) {
    return <ErrorCard />
  }

  return (
    <KTCard flush>
      <KTCard.Header>
        <KTCard.Title />
        <KTCard.Toolbar>
          <PermissionsControl allow={PagePermission.ADMIN_PROJECT_SERVICE_CREATE}>
            <NavLink to="/admin/project-services/create">
              <Button theme="primary">
                <i className="fa-solid fa-plus" />
                <FormattedMessage id="project_service.button.add" />
              </Button>
            </NavLink>
          </PermissionsControl>
        </KTCard.Toolbar>
      </KTCard.Header>

      <KTCard.Body className="p-0">
        <Table
          data={data.nodes}
          columns={columns}
          isLoading={isFetching}
        />

        {data.total > 0 && (
          <div className="d-flex justify-content-end px-10 pb-4">
            <Pagination
              current={page}
              pageSize={data.limit}
              total={data.total}
              onChange={setPage}
            />
          </div>
        )}
      </KTCard.Body>
    </KTCard>
  )
}

export default ProjectServiceListPage
