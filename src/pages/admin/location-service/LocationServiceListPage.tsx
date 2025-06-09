import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

import AdminLocationServicesAPI from '@api/admin/locationServiceAPI'

import { LocationServiceModel } from '@models/locationService'

import { Button } from '@components/Button'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { KTCard } from '@components/KTCard'
import Pagination from '@components/Pagination'
import { Table } from '@components/Table'

import locationServiceColumns, {
  locationServiceColumnHelper,
} from '@modules/location-service/utils/locationServiceColumnHelper'
import { PermissionsControl } from '@modules/permissions'

import { PagePermission } from '@/constants/pagePermission'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

const LocationServiceListPage: FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()

  const { query, page, setPage } = useRequestState<LocationServiceModel>()

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [QUERIES.ADMIN_LOCATION_SERVICE_LIST, query],
    queryFn: () => AdminLocationServicesAPI.filter(query),
    select: (r) => r.data.data,
  })

  const deleteLocationService = useCallback(
    async (item: LocationServiceModel) => {
      try {
        const { isConfirmed } = await alert.warning({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: item.default_title }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })

        if (!isConfirmed) return

        await AdminLocationServicesAPI.delete(item.id)
        refetch()
        toast.success(intl.formatMessage({ id: 'location_service.message.delete_location_success' }))
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
      locationServiceColumns.image,
      locationServiceColumns.title,
      locationServiceColumns.updatedAt,
      locationServiceColumnHelper.display({
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
              <PermissionsControl allow={PagePermission.ADMIN_LOCATION_SERVICE_DETAIL}>
                <NavLink to={`/admin/location-services/${row.original.id}`}>
                  <Button
                    variant="icon"
                    theme="secondary"
                  >
                    <i className="fa-solid fa-eye" />
                  </Button>
                </NavLink>
              </PermissionsControl>

              <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_SERVICE_DELETE}>
                <Button
                  variant="icon"
                  theme="secondary"
                  onClick={() => deleteLocationService(row.original)}
                >
                  <i className="fa-solid fa-trash" />
                </Button>
              </PermissionsControl>
            </div>
          )
        },
      }),
    ],
    [deleteLocationService]
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
          <PermissionsControl allow={PagePermission.ADMIN_LOCATION_SERVICE_CREATE}>
            <NavLink to="/admin/location-services/create">
              <Button theme="primary">
                <i className="fa-solid fa-plus" />
                <FormattedMessage id="location_service.button.add" />
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

export default LocationServiceListPage
