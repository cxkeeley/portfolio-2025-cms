import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import AdminDoctorsAPI, { PayloadUpdateDoctor } from '@api/admin/doctorsAPI'

import { ID } from '@models/base'
import { Option } from '@models/option'

import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import DoctorUpdateFormCard, { DoctorUpdateFormShape } from '@modules/doctor/components/DoctorUpdateFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

type Props = {}

const DoctorUpdatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()
  const { doctorId } = useParams()

  const { data, error } = useQuery({
    queryKey: [QUERIES.DOCTOR_DETAIL, doctorId],
    queryFn: () => AdminDoctorsAPI.get(doctorId!),
    select: (response) => response.data.data?.doctor,
  })

  const goBack = () => {
    navigate(-1)
  }

  const goToDetail = (id: ID) => {
    navigate(`/admin/doctors/${id}`)
  }

  const handleSubmit = async (values: DoctorUpdateFormShape) => {
    const payload = FormUtil.parseValues<PayloadUpdateDoctor>({
      ...values,
      start_practice_month: values.start_practice_month ? Number(values.start_practice_month.value) : 0,
      start_practice_year: values.start_practice_year ? Number(values.start_practice_year) : 0,
    })

    const response = await AdminDoctorsAPI.update(doctorId!, payload)

    toast.success(intl.formatMessage({ id: 'doctor.alert.update_doctor_success' }))

    if (response.data.data) {
      goToDetail(response.data.data.doctor.id)
    } else {
      goBack()
    }
  }

  if (error) {
    return <ErrorCard />
  }

  if (data) {
    const initialValues: DoctorUpdateFormShape = {
      slug: data.slug,
      degree: data.degree,
      name: data.name,
      job_title: data.job_title,
      is_active: data.is_active,
      location_id: data.location
        ? new Option({
            label: data.location.name,
            value: data.location.id,
          })
        : null,
      image_file_path: null,
      thumbnail_file_path: null,
      start_practice_month: data.start_practice_month
        ? new Option({
            label: intl.formatMessage({ id: `enum.month.${data.start_practice_month}` }),
            value: data.start_practice_month.toString(),
          })
        : null,
      start_practice_year: String(data.start_practice_year),
    }

    return (
      <DoctorUpdateFormCard
        initialValues={initialValues}
        initialImageSrc={data.image_file.link}
        initialThubmnailSrc={data.thumbnail_file.link}
        onCancel={goBack}
        onSubmit={handleSubmit}
      />
    )
  }

  return <FloatLoadingIndicator />
}

export default DoctorUpdatePage
