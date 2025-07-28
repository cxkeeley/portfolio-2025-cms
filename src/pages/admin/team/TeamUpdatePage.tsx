import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import AdminTeamsAPI, { PayloadUpdateTeam } from '@api/admin/teamsAPI'

import { ID } from '@models/base'
import { Option } from '@models/option'

import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import TeamUpdateFormCard, { TeamUpdateFormShape } from '@modules/team/components/TeamUpdateFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

type Props = {}

const TeamUpdatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()
  const { teamId } = useParams()

  const { data, error } = useQuery({
    queryKey: [QUERIES.TEAM_DETAIL, teamId],
    queryFn: () => AdminTeamsAPI.get(teamId!),
    select: (response) => response.data.data?.team,
  })

  const goBack = () => {
    navigate(-1)
  }

  const goToDetail = (id: ID) => {
    navigate(`/admin/teams/${id}`)
  }

  const handleSubmit = async (values: TeamUpdateFormShape) => {
    const payload = FormUtil.parseValues<PayloadUpdateTeam>({
      ...values,
      start_practice_month: values.start_practice_month ? Number(values.start_practice_month.value) : 0,
      start_practice_year: values.start_practice_year ? Number(values.start_practice_year) : 0,
    })

    const response = await AdminTeamsAPI.update(teamId!, payload)

    toast.success(intl.formatMessage({ id: 'team.alert.update_team_success' }))

    if (response.data.data) {
      goToDetail(response.data.data.team.id)
    } else {
      goBack()
    }
  }

  if (error) {
    return <ErrorCard />
  }

  if (data) {
    const initialValues: TeamUpdateFormShape = {
      slug: data.slug,
      degree: data.degree,
      name: data.name,
      job_title: data.job_title,
      is_active: data.is_active,
      project_id: data.project
        ? new Option({
            label: data.project.name,
            value: data.project.id,
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
      <TeamUpdateFormCard
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

export default TeamUpdatePage
