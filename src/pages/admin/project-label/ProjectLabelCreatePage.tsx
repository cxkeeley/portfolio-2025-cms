import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminProjectLabelsAPI, { PayloadCreateProjectLabel } from '@api/admin/projectLabelsAPI'

import ProjectLabelFormCard, {
  ProjectLabelFormCardShape,
} from '@modules/project-label/components/ProjectLabelFormCard/ProjectLabelFormCard'

import { QUERIES } from '@/constants/queries'
import FormUtil from '@/utils/formUtil'

type Props = {}

const ProjectLabelCreatePage: FC<Props> = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  const handleSubmit = async (values: ProjectLabelFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadCreateProjectLabel>(values)
    const response = await AdminProjectLabelsAPI.create(payload)
    queryClient.invalidateQueries([QUERIES.PROJECT_GROUP_LIST])
    navigate(`/admin/project-labels/${response.data.data?.project_label.id}`)
  }

  return (
    <ProjectLabelFormCard
      onCancel={goBack}
      onSubmit={handleSubmit}
    />
  )
}

export default ProjectLabelCreatePage
