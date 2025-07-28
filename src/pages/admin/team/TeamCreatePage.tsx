import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminTeamsAPI, { PayloadCreateTeam } from '@api/admin/teamsAPI'

import { ID } from '@models/base'

import TeamCreateFormCard, { TeamCreateFormShape } from '@modules/team/components/TeamCreateFormCard'

import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

type Props = {}

const TeamCreatePage: FC<Props> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const intl = useIntl()

  const goBack = () => {
    navigate(-1)
  }

  const goToDetail = (teamId: ID) => {
    navigate(`/admin/teams/${teamId}`)
  }

  const handleSubmit = async (values: TeamCreateFormShape) => {
    const payload = FormUtil.parseValues<PayloadCreateTeam>({
      ...values,
      start_practice_month: values.start_practice_month ? Number(values.start_practice_month.value) : 0,
      start_practice_year: values.start_practice_year ? Number(values.start_practice_year) : 0,
    })

    const { data } = await AdminTeamsAPI.create(payload)

    toast.success(intl.formatMessage({ id: 'team.alert.create_team_success' }))

    if (data.data?.team) {
      goToDetail(data.data.team.id)
    } else {
      goBack()
    }
  }

  return (
    <TeamCreateFormCard
      onCancel={goBack}
      onSubmit={handleSubmit}
    />
  )
}

export default TeamCreatePage
