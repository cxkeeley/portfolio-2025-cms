import { useMutation, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import AdminTeamsAPI from '@api/admin/teamsAPI'

import { ID } from '@models/base'
import TeamModel from '@models/team'

import { Button } from '@components/Button'
import ErrorCard from '@components/ErrorCard/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { FormatDate } from '@components/FormatDate'
import { KTCard } from '@components/KTCard'
import Pagination from '@components/Pagination'
import { SearchBar } from '@components/SearchBar'
import { Table } from '@components/Table'

import { PermissionsControl } from '@modules/permissions'
import TeamNameCell from '@modules/team/components/TeamNameCell'
import teamColumnHelper from '@modules/team/utils/teamColumnHelper'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

type Props = {}

const TeamListPage: FC<Props> = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const { query, page, phrase, setPhrase, setPage } = useRequestState<TeamModel>()

  const { data, isFetching, isLoading, refetch, error } = useQuery({
    keepPreviousData: true,
    queryKey: [QUERIES.TEAM_LIST, query],
    queryFn: () => AdminTeamsAPI.filter(query),
    select: (r) => r.data.data,
  })

  const { mutate: deleteTeam, isLoading: isDeletingTeam } = useMutation({
    mutationFn: (teamId: ID) => AdminTeamsAPI.delete(teamId),
    onSuccess: () => {
      refetch()
      toast.success(intl.formatMessage({ id: 'team.alert.delete_team_success' }))
    },
    onError: (err) => {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    },
  })

  const handleDelete = useCallback(
    async (team: TeamModel) => {
      const { isConfirmed } = await alert.warning({
        text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: team.name }),
        confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
      })

      if (isConfirmed) {
        deleteTeam(team.id)
      }
    },
    [alert, deleteTeam, intl]
  )

  const columns: ColumnDef<TeamModel, string>[] = useMemo(
    () => [
      teamColumnHelper.display({
        id: 'image',
        size: 350,
        header: () => <FormattedMessage id="team.label.name" />,
        cell: ({ row }) => (
          <TeamNameCell
            imageSrc={row.original.thumbnail_file.link}
            degree={row.original.degree}
            name={row.original.name}
          />
        ),
      }),
      teamColumnHelper.accessor((info) => info.job_title, {
        id: 'job_title',
        size: 200,
        header: () => <FormattedMessage id="team.label.job_title" />,
        cell: (info) => info.getValue(),
      }),
      teamColumnHelper.display({
        id: 'project',
        size: 200,
        header: () => <FormattedMessage id="team.label.project" />,
        cell: ({ row }) => row.original.project?.name || '-',
      }),
      teamColumnHelper.accessor((info) => info.updated_at, {
        id: 'updated_at',
        size: 150,
        header: () => <FormattedMessage id="table.updated_at" />,
        cell: (info) => (
          <FormatDate
            date={info.getValue()}
            withTime
          />
        ),
      }),
      teamColumnHelper.display({
        id: 'action',
        size: 150,
        header: () => (
          <div className="text-end">
            <FormattedMessage id="table.action" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="d-flex justify-content-end gap-3">
            <PermissionsControl allow={PermissionEnum.ADMIN_TEAM_SHOW}>
              <Link
                className="btn btn-secondary btn-icon"
                to={`/admin/teams/${row.original.id}`}
              >
                <i className="fa-solid fa-eye" />
              </Link>
            </PermissionsControl>

            <PermissionsControl allow={PermissionEnum.ADMIN_TEAM_DELETE}>
              <Button
                variant="icon"
                theme="secondary"
                onClick={() => handleDelete(row.original)}
                isLoading={isDeletingTeam}
              >
                <i className="fa-solid fa-trash" />
              </Button>
            </PermissionsControl>
          </div>
        ),
      }),
    ],
    [handleDelete, isDeletingTeam]
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
          onChange={setPhrase}
          placeholder={intl.formatMessage({ id: 'team.placeholder.search' })}
        />

        <KTCard.Toolbar>
          <PermissionsControl allow={PermissionEnum.ADMIN_TEAM_CREATE}>
            <Link
              className="btn btn-primary"
              to="/admin/teams/create"
            >
              <i className="fa-solid fa-plus" />
              <FormattedMessage id="team.button.add_team" />
            </Link>
          </PermissionsControl>
        </KTCard.Toolbar>
      </KTCard.Header>

      <KTCard.Body className="p-0 pb-6">
        <Table
          columns={columns}
          isLoading={isFetching}
          data={data.nodes}
        />

        {data.total > 0 && (
          <div className="d-flex justify-content-end px-10">
            <Pagination
              current={page}
              total={data.total}
              pageSize={data.limit}
              onChange={setPage}
            />
          </div>
        )}
      </KTCard.Body>
    </KTCard>
  )
}

export default TeamListPage
