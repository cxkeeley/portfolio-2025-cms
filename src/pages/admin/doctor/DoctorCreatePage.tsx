import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminDoctorsAPI, { PayloadCreateDoctor } from '@api/admin/teamsAPI'

import { ID } from '@models/base'

import DoctorCreateFormCard, { DoctorCreateFormShape } from '@modules/doctor/components/DoctorCreateFormCard'

import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

type Props = {}

const DoctorCreatePage: FC<Props> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const intl = useIntl()

  const goBack = () => {
    navigate(-1)
  }

  const goToDetail = (doctorId: ID) => {
    navigate(`/admin/doctors/${doctorId}`)
  }

  const handleSubmit = async (values: DoctorCreateFormShape) => {
    const payload = FormUtil.parseValues<PayloadCreateDoctor>({
      ...values,
      start_practice_month: values.start_practice_month ? Number(values.start_practice_month.value) : 0,
      start_practice_year: values.start_practice_year ? Number(values.start_practice_year) : 0,
    })

    const { data } = await AdminDoctorsAPI.create(payload)

    toast.success(intl.formatMessage({ id: 'doctor.alert.create_doctor_success' }))

    if (data.data?.doctor) {
      goToDetail(data.data.doctor.id)
    } else {
      goBack()
    }
  }

  return (
    <DoctorCreateFormCard
      onCancel={goBack}
      onSubmit={handleSubmit}
    />
  )
}

export default DoctorCreatePage
