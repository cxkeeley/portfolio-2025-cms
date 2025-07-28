import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

import AdminProjectGroupsAPI from '@api/admin/projectGroupsAPI'

import { ProjectGroupModel } from '@models/projectGroup'

import { Button } from '@components/Button'
import EmptyPlaceholderText from '@components/EmptyPlaceholderText'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { FormatDate } from '@components/FormatDate'
import { KTCard } from '@components/KTCard'
import Pagination from '@components/Pagination'
import { SearchBar } from '@components/SearchBar'
import { Table } from '@components/Table'

import { PermissionsControl } from '@modules/permissions'
import ProjectGroupImage from '@modules/project-group/components/ProjectGroupImage'
import projectGroupColumnHelper from '@modules/project-group/utils/projectGroupColumnHelper'

import { PagePermission } from '@/constants/pagePermission'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

const ProjectGroupListPage: FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()

  const { query, phrase, page, setPhrase, setPage } = useRequestState<ProjectGroupModel>()

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    keepPreviousData: true,
    queryKey: [QUERIES.PROJECT_GROUP_LIST, query],
    queryFn: () => AdminProjectGroupsAPI.filter(query),
    select: (r) => r.data.data,
  })

  const handleSearch = (keyword?: string) => {
    setPage(1)
    setPhrase(keyword)
  }

  const deleteProjectGroup = useCallback(
    async (item: ProjectGroupModel) => {
      try {
        const { isConfirmed } = await alert.warning({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: item.name }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })

        if (!isConfirmed) return

        await AdminProjectGroupsAPI.delete(item.id)
        refetch()
        toast.success(intl.formatMessage({ id: 'project_group.alert.delete_project_success' }))
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
      projectGroupColumnHelper.display({
        id: 'project_group',
        size: 120,
        header: () => <FormattedMessage id="vocabulary.image" />,
        cell: ({ row }) => (
          <div className="pe-5">
            {row.original.image_file ? (
              <ProjectGroupImage
                src={row.original.image_file.link}
                alt={row.original.name}
                className="rounded"
                width="100%"
                height="auto"
              />
            ) : (
              <EmptyPlaceholderText />
            )}
          </div>
        ),
      }),
      projectGroupColumnHelper.accessor((info) => info.name, {
        id: 'name',
        size: 300,
        header: () => <FormattedMessage id="vocabulary.name" />,
        cell: (info) => info.getValue() || <EmptyPlaceholderText />,
      }),
      projectGroupColumnHelper.accessor((info) => info.updated_at, {
        id: 'updated_at',
        size: 175,
        header: () => <FormattedMessage id="table.updated_at" />,
        cell: (info) => (
          <FormatDate
            date={info.getValue()}
            withTime
          />
        ),
      }),
      projectGroupColumnHelper.display({
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
              <PermissionsControl allow={PagePermission.ADMIN_PROJECT_GROUP_DETAIL}>
                <NavLink to={`/admin/project-groups/${row.original.id}`}>
                  <Button
                    variant="icon"
                    theme="secondary"
                  >
                    <i className="fa-solid fa-eye" />
                  </Button>
                </NavLink>
              </PermissionsControl>

              <PermissionsControl allow={PermissionEnum.ADMIN_PROJECT_GROUP_DELETE}>
                <Button
                  variant="icon"
                  theme="secondary"
                  onClick={() => deleteProjectGroup(row.original)}
                >
                  <i className="fa-solid fa-trash" />
                </Button>
              </PermissionsControl>
            </div>
          )
        },
      }),
    ],
    [deleteProjectGroup]
  )

  if (data) {
    return (
      <KTCard flush>
        <KTCard.Header>
          <SearchBar
            initialValue={phrase}
            onChange={handleSearch}
            placeholder={intl.formatMessage({
              id: 'project_group.placeholder.search',
            })}
          />

          <KTCard.Toolbar>
            <PermissionsControl allow={PagePermission.ADMIN_PROJECT_GROUP_CREATE}>
              <NavLink to="/admin/project-groups/create">
                <Button theme="primary">
                  <i className="fa-solid fa-plus" />
                  <FormattedMessage id="project_group.button.add" />
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

  if (isLoading) {
    return <FloatLoadingIndicator />
  }

  if (error) {
    return <ErrorCard />
  }

  return null
}

export default ProjectGroupListPage
