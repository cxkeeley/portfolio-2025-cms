import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

import AdminLocationLabelsAPI from '@api/admin/projectLabelsAPI'

import { LocationLabelModel } from '@models/projectLabel'

import { Button } from '@components/Button'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { KTCard } from '@components/KTCard'
import Pagination from '@components/Pagination'
import { SearchBar } from '@components/SearchBar'
import { Table } from '@components/Table'

import locationLabelColumns, {
  locationLabelColumnHelper,
} from '@modules/location-label/utils/locationLabelColumnHelper'
import { PermissionsControl } from '@modules/permissions'

import { PagePermission } from '@/constants/pagePermission'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

const LocationLabelListPage: FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()

  const { query, phrase, page, setPhrase, setPage } = useRequestState<LocationLabelModel>()

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [QUERIES.ADMIN_LOCATION_LABEL_LIST, query],
    queryFn: () => AdminLocationLabelsAPI.filter(query),
    keepPreviousData: true,
    select: (r) => r.data.data,
  })

  const handleSearch = (keyword?: string) => {
    setPage(1)
    setPhrase(keyword)
  }

  const deleteLocationLabel = useCallback(
    async (item: LocationLabelModel) => {
      try {
        const { isConfirmed } = await alert.warning({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: item.default_name }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })

        if (!isConfirmed) return

        await AdminLocationLabelsAPI.delete(item.id)
        refetch()
        toast.success(intl.formatMessage({ id: 'location_label.message.delete_location_label_success' }))
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
      locationLabelColumns.mapIcon,
      locationLabelColumns.name,
      locationLabelColumns.updatedAt,
      locationLabelColumnHelper.display({
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
              <PermissionsControl allow={PagePermission.ADMIN_LOCATION_LABEL_DETAIL}>
                <NavLink to={`/admin/location-labels/${row.original.id}`}>
                  <Button
                    variant="icon"
                    theme="secondary"
                  >
                    <i className="fa-solid fa-eye" />
                  </Button>
                </NavLink>
              </PermissionsControl>

              <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_LABEL_DELETE}>
                <Button
                  variant="icon"
                  theme="secondary"
                  onClick={() => deleteLocationLabel(row.original)}
                >
                  <i className="fa-solid fa-trash" />
                </Button>
              </PermissionsControl>
            </div>
          )
        },
      }),
    ],
    [deleteLocationLabel]
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
            id: 'location_label.placeholder.search',
          })}
        />

        <KTCard.Toolbar>
          <PermissionsControl allow={PagePermission.ADMIN_LOCATION_LABEL_CREATE}>
            <NavLink to="/admin/location-labels/create">
              <Button theme="primary">
                <i className="fa-solid fa-plus" />
                <FormattedMessage id="location_label.button.add" />
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

export default LocationLabelListPage
