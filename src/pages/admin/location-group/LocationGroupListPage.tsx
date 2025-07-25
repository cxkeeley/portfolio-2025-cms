import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

import AdminLocationGroupsAPI from '@api/admin/projectGroupsAPI'

import { LocationGroupModel } from '@models/projectGroup'

import { Button } from '@components/Button'
import EmptyPlaceholderText from '@components/EmptyPlaceholderText'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { FormatDate } from '@components/FormatDate'
import { KTCard } from '@components/KTCard'
import Pagination from '@components/Pagination'
import { SearchBar } from '@components/SearchBar'
import { Table } from '@components/Table'

import LocationGroupImage from '@modules/location-group/components/LocationGroupImage'
import locationGroupColumnHelper from '@modules/location-group/utils/locationGroupColumnHelper'
import { PermissionsControl } from '@modules/permissions'

import { PagePermission } from '@/constants/pagePermission'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

const LocationGroupListPage: FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()

  const { query, phrase, page, setPhrase, setPage } = useRequestState<LocationGroupModel>()

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    keepPreviousData: true,
    queryKey: [QUERIES.LOCATION_GROUP_LIST, query],
    queryFn: () => AdminLocationGroupsAPI.filter(query),
    select: (r) => r.data.data,
  })

  const handleSearch = (keyword?: string) => {
    setPage(1)
    setPhrase(keyword)
  }

  const deleteLocationGroup = useCallback(
    async (item: LocationGroupModel) => {
      try {
        const { isConfirmed } = await alert.warning({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: item.name }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })

        if (!isConfirmed) return

        await AdminLocationGroupsAPI.delete(item.id)
        refetch()
        toast.success(intl.formatMessage({ id: 'location_group.alert.delete_location_success' }))
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
      locationGroupColumnHelper.display({
        id: 'location_group',
        size: 120,
        header: () => <FormattedMessage id="vocabulary.image" />,
        cell: ({ row }) => (
          <div className="pe-5">
            {row.original.image_file ? (
              <LocationGroupImage
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
      locationGroupColumnHelper.accessor((info) => info.name, {
        id: 'name',
        size: 300,
        header: () => <FormattedMessage id="vocabulary.name" />,
        cell: (info) => info.getValue() || <EmptyPlaceholderText />,
      }),
      locationGroupColumnHelper.accessor((info) => info.updated_at, {
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
      locationGroupColumnHelper.display({
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
              <PermissionsControl allow={PagePermission.ADMIN_LOCATION_GROUP_DETAIL}>
                <NavLink to={`/admin/location-groups/${row.original.id}`}>
                  <Button
                    variant="icon"
                    theme="secondary"
                  >
                    <i className="fa-solid fa-eye" />
                  </Button>
                </NavLink>
              </PermissionsControl>

              <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_GROUP_DELETE}>
                <Button
                  variant="icon"
                  theme="secondary"
                  onClick={() => deleteLocationGroup(row.original)}
                >
                  <i className="fa-solid fa-trash" />
                </Button>
              </PermissionsControl>
            </div>
          )
        },
      }),
    ],
    [deleteLocationGroup]
  )

  if (data) {
    return (
      <KTCard flush>
        <KTCard.Header>
          <SearchBar
            initialValue={phrase}
            onChange={handleSearch}
            placeholder={intl.formatMessage({
              id: 'location_group.placeholder.search',
            })}
          />

          <KTCard.Toolbar>
            <PermissionsControl allow={PagePermission.ADMIN_LOCATION_GROUP_CREATE}>
              <NavLink to="/admin/location-groups/create">
                <Button theme="primary">
                  <i className="fa-solid fa-plus" />
                  <FormattedMessage id="location_group.button.add" />
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

export default LocationGroupListPage
