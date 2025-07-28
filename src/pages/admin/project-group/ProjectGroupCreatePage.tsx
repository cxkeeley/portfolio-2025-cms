import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminProjectGroupsAPI, { PayloadProjectGroupCreate } from '@api/admin/projectGroupsAPI'

import { ProjectGroupFormCardShape } from '@modules/project-group/components/ProjectGroupFormCard'
import ProjectGroupFormCard from '@modules/project-group/components/ProjectGroupFormCard/ProjectGroupFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

type Props = {}

const ProjectGroupCreatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  const handleSubmit = async (values: ProjectGroupFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadProjectGroupCreate>(values)
    const response = await AdminProjectGroupsAPI.create(payload)
    queryClient.invalidateQueries([QUERIES.PROJECT_GROUP_LIST])
    toast.success(intl.formatMessage({ id: 'project_group.message.create_success' }))
    navigate(`/admin/project-groups/${response.data.data?.project_group.id}`)
  }

  return (
    <ProjectGroupFormCard
      onCancel={goBack}
      onSubmit={handleSubmit}
    />
  )
}

export default ProjectGroupCreatePage
