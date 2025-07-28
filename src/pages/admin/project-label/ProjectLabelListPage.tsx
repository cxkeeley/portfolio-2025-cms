import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

import AdminProjectLabelsAPI from '@api/admin/projectLabelsAPI'

import { ProjectLabelModel } from '@models/projectLabel'

import { Button } from '@components/Button'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { KTCard } from '@components/KTCard'
import Pagination from '@components/Pagination'
import { SearchBar } from '@components/SearchBar'
import { Table } from '@components/Table'

import { PermissionsControl } from '@modules/permissions'
import projectLabelColumns, { projectLabelColumnHelper } from '@modules/project-label/utils/projectLabelColumnHelper'

import { PagePermission } from '@/constants/pagePermission'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

const ProjectLabelListPage: FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()

  const { query, phrase, page, setPhrase, setPage } = useRequestState<ProjectLabelModel>()

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [QUERIES.ADMIN_PROJECT_LABEL_LIST, query],
    queryFn: () => AdminProjectLabelsAPI.filter(query),
    keepPreviousData: true,
    select: (r) => r.data.data,
  })

  const handleSearch = (keyword?: string) => {
    setPage(1)
    setPhrase(keyword)
  }

  const deleteProjectLabel = useCallback(
    async (item: ProjectLabelModel) => {
      try {
        const { isConfirmed } = await alert.warning({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: item.default_name }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })

        if (!isConfirmed) return

        await AdminProjectLabelsAPI.delete(item.id)
        refetch()
        toast.success(intl.formatMessage({ id: 'project_label.message.delete_project_label_success' }))
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
      projectLabelColumns.mapIcon,
      projectLabelColumns.name,
      projectLabelColumns.updatedAt,
      projectLabelColumnHelper.display({
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
              <PermissionsControl allow={PagePermission.ADMIN_PROJECT_LABEL_DETAIL}>
                <NavLink to={`/admin/project-labels/${row.original.id}`}>
                  <Button
                    variant="icon"
                    theme="secondary"
                  >
                    <i className="fa-solid fa-eye" />
                  </Button>
                </NavLink>
              </PermissionsControl>

              <PermissionsControl allow={PermissionEnum.ADMIN_PROJECT_LABEL_DELETE}>
                <Button
                  variant="icon"
                  theme="secondary"
                  onClick={() => deleteProjectLabel(row.original)}
                >
                  <i className="fa-solid fa-trash" />
                </Button>
              </PermissionsControl>
            </div>
          )
        },
      }),
    ],
    [deleteProjectLabel]
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
        <SearchBar
          initialValue={phrase}
          onChange={handleSearch}
          placeholder={intl.formatMessage({
            id: 'project_label.placeholder.search',
          })}
        />

        <KTCard.Toolbar>
          <PermissionsControl allow={PagePermission.ADMIN_PROJECT_LABEL_CREATE}>
            <NavLink to="/admin/project-labels/create">
              <Button theme="primary">
                <i className="fa-solid fa-plus" />
                <FormattedMessage id="project_label.button.add" />
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

export default ProjectLabelListPage
