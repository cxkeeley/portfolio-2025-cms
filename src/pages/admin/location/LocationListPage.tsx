import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import AdminLocationsAPI, { PayloadAdminLocationFilter } from '@api/admin/projectsAPI'

import { LocationModel } from '@models/project'

import { Button } from '@components/Button'
import EmptyPlaceholderText from '@components/EmptyPlaceholderText'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { KTBadge } from '@components/KTBadge'
import { KTCard } from '@components/KTCard'
import Pagination from '@components/Pagination'
import { SearchBar } from '@components/SearchBar'
import { Table } from '@components/Table'
import { DateCell } from '@components/Table/Cell/DateCell'

import LocationImage from '@modules/article/components/ArticleImage/ArticleImage'
import {
  LocationListFormFilter,
  LocationListFormFilterShape,
} from '@modules/location/components/LocationListFormFilter'
import locationColumnHelper from '@modules/location/utils/locationColumnHelper'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

const LocationListPage: FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const { query, phrase, page, filters, setPhrase, setPage, setFilters } = useRequestState<
    LocationModel,
    LocationListFormFilterShape
  >()

  const { data, isFetching, isLoading, refetch, error } = useQuery({
    keepPreviousData: true,
    queryKey: [QUERIES.ADMIN_LOCATION_LIST, query],
    queryFn: () => AdminLocationsAPI.filter(query as unknown as PayloadAdminLocationFilter),
    select: (r) => r.data.data,
  })

  const handleFilter = (values: LocationListFormFilterShape) => {
    setFilters(values)
  }

  const handleDelete = useCallback(
    async (item: LocationModel) => {
      try {
        const { isConfirmed } = await alert.warning({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: item.short_name }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })
        if (!isConfirmed) return

        await AdminLocationsAPI.delete(item.id)
        refetch()
        toast.success(intl.formatMessage({ id: 'location.alert.delete_location_success' }))
      } catch (err) {
        if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
          alert.error({ text: err.response?.data.message })
        } else {
          alert.error({ text: String(err) })
        }
      }
    },
    [alert, intl, refetch, toast]
  )

  const columns = useMemo(
    () => [
      locationColumnHelper.display({
        id: 'image',
        size: 135,
        header: () => <FormattedMessage id="vocabulary.image" />,
        cell: ({ row }) => (
          <div className="pe-5">
            {row.original.image_file ? <LocationImage src={row.original.image_file.link} /> : <EmptyPlaceholderText />}
          </div>
        ),
      }),
      locationColumnHelper.display({
        id: 'name',
        size: 300,
        header: () => <FormattedMessage id="location.label.name" />,
        cell: ({ row }) => (
          <div>
            <KTBadge variant="light-primary">{row.original.short_name}</KTBadge>
            <div className="mt-2">{row.original.name}</div>
          </div>
        ),
      }),
      locationColumnHelper.accessor('phone_number', {
        id: 'phone_number',
        size: 100,
        header: () => <FormattedMessage id="location.label.phone_number" />,
        cell: (props) => <>{props.getValue()}</>,
      }),
      locationColumnHelper.accessor('is_coming_soon', {
        id: 'is_coming_soon',
        size: 100,
        header: () => <FormattedMessage id="location.label.status" />,
        cell: (props) =>
          props.getValue() === true ? (
            <KTBadge
              size="lg"
              variant="light-warning"
            >
              <FormattedMessage id="location.badge.coming_soon" />
            </KTBadge>
          ) : (
            <KTBadge
              size="lg"
              variant="light-success"
            >
              <FormattedMessage id="location.badge.active" />
            </KTBadge>
          ),
      }),
      locationColumnHelper.accessor('updated_at', {
        id: 'updated_at',
        size: 175,
        header: () => <FormattedMessage id="model.updated_at" />,
        cell: (props) => (
          <DateCell
            date={props.getValue()}
            withTime
          />
        ),
      }),
      locationColumnHelper.display({
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
              <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_SHOW}>
                <Link
                  className="btn btn-secondary btn-icon"
                  to={`/admin/locations/${row.original.id}`}
                >
                  <i className="fa-solid fa-eye" />
                </Link>
              </PermissionsControl>

              <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_DELETE}>
                <Button
                  variant="icon"
                  theme="secondary"
                  onClick={() => handleDelete(row.original)}
                >
                  <i className="fa-solid fa-trash" />
                </Button>
              </PermissionsControl>
            </div>
          )
        },
      }),
    ],
    [handleDelete]
  )

  if (data) {
    return (
      <KTCard flush>
        <KTCard.Header>
          <SearchBar
            initialValue={phrase}
            onChange={setPhrase}
            placeholder={intl.formatMessage({ id: 'location.placeholder.search' })}
          />

          <KTCard.Toolbar>
            <LocationListFormFilter
              initialValues={filters}
              onReset={() => setFilters(undefined)}
              onSubmit={handleFilter}
            />

            <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_CREATE}>
              <Link
                className="btn btn-primary"
                to="/admin/locations/create"
              >
                <i className="fa-solid fa-plus" />
                <FormattedMessage id="location.button.add_location" />
              </Link>
            </PermissionsControl>
          </KTCard.Toolbar>
        </KTCard.Header>

        <KTCard.Body className="p-0 pb-6">
          <Table
            data={data.nodes}
            columns={columns}
            isLoading={isFetching}
          />

          {data.total > 0 && (
            <div className="d-flex justify-content-end px-10">
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

export default LocationListPage
