import { useMutation, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import AdminDoctorsAPI from '@api/admin/teamsAPI'

import { ID } from '@models/base'
import DoctorModel from '@models/team'

import { Button } from '@components/Button'
import ErrorCard from '@components/ErrorCard/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { FormatDate } from '@components/FormatDate'
import { KTCard } from '@components/KTCard'
import Pagination from '@components/Pagination'
import { SearchBar } from '@components/SearchBar'
import { Table } from '@components/Table'

import DoctorNameCell from '@modules/doctor/components/DoctorNameCell'
import doctorColumnHelper from '@modules/doctor/utils/doctorColumnHelper'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

type Props = {}

const DoctorListPage: FC<Props> = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const { query, page, phrase, setPhrase, setPage } = useRequestState<DoctorModel>()

  const { data, isFetching, isLoading, refetch, error } = useQuery({
    keepPreviousData: true,
    queryKey: [QUERIES.DOCTOR_LIST, query],
    queryFn: () => AdminDoctorsAPI.filter(query),
    select: (r) => r.data.data,
  })

  const { mutate: deleteDoctor, isLoading: isDeletingDoctor } = useMutation({
    mutationFn: (doctorId: ID) => AdminDoctorsAPI.delete(doctorId),
    onSuccess: () => {
      refetch()
      toast.success(intl.formatMessage({ id: 'doctor.alert.delete_doctor_success' }))
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
    async (doctor: DoctorModel) => {
      const { isConfirmed } = await alert.warning({
        text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: doctor.name }),
        confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
      })

      if (isConfirmed) {
        deleteDoctor(doctor.id)
      }
    },
    [alert, deleteDoctor, intl]
  )

  const columns: ColumnDef<DoctorModel, string>[] = useMemo(
    () => [
      doctorColumnHelper.display({
        id: 'image',
        size: 350,
        header: () => <FormattedMessage id="doctor.label.name" />,
        cell: ({ row }) => (
          <DoctorNameCell
            imageSrc={row.original.thumbnail_file.link}
            degree={row.original.degree}
            name={row.original.name}
          />
        ),
      }),
      doctorColumnHelper.accessor((info) => info.job_title, {
        id: 'job_title',
        size: 200,
        header: () => <FormattedMessage id="doctor.label.job_title" />,
        cell: (info) => info.getValue(),
      }),
      doctorColumnHelper.display({
        id: 'location',
        size: 200,
        header: () => <FormattedMessage id="doctor.label.location" />,
        cell: ({ row }) => row.original.location?.name || '-',
      }),
      doctorColumnHelper.accessor((info) => info.updated_at, {
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
      doctorColumnHelper.display({
        id: 'action',
        size: 150,
        header: () => (
          <div className="text-end">
            <FormattedMessage id="table.action" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="d-flex justify-content-end gap-3">
            <PermissionsControl allow={PermissionEnum.ADMIN_DOCTOR_SHOW}>
              <Link
                className="btn btn-secondary btn-icon"
                to={`/admin/doctors/${row.original.id}`}
              >
                <i className="fa-solid fa-eye" />
              </Link>
            </PermissionsControl>

            <PermissionsControl allow={PermissionEnum.ADMIN_DOCTOR_DELETE}>
              <Button
                variant="icon"
                theme="secondary"
                onClick={() => handleDelete(row.original)}
                isLoading={isDeletingDoctor}
              >
                <i className="fa-solid fa-trash" />
              </Button>
            </PermissionsControl>
          </div>
        ),
      }),
    ],
    [handleDelete, isDeletingDoctor]
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
          placeholder={intl.formatMessage({ id: 'doctor.placeholder.search' })}
        />

        <KTCard.Toolbar>
          <PermissionsControl allow={PermissionEnum.ADMIN_DOCTOR_CREATE}>
            <Link
              className="btn btn-primary"
              to="/admin/doctors/create"
            >
              <i className="fa-solid fa-plus" />
              <FormattedMessage id="doctor.button.add_doctor" />
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

export default DoctorListPage
