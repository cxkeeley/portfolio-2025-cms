import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminProjectServicesAPI, { PayloadProjectServiceCreate } from '@api/admin/projectServiceAPI'

import { ProjectGroupFormCardShape } from '@modules/project-group/components/ProjectGroupFormCard'
import ProjectServiceFormCard from '@modules/project-service/components/ProjectServiceFormCard/ProjectServiceFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

type Props = {}

const ProjectServiceCreatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  const handleSubmit = async (values: ProjectGroupFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadProjectServiceCreate>(values)
    const response = await AdminProjectServicesAPI.create(payload)
    queryClient.invalidateQueries([QUERIES.ADMIN_PROJECT_SERVICE_LIST])
    toast.success(intl.formatMessage({ id: 'project_service.message.create_success' }))
    navigate(`/admin/project-services/${response.data.data?.project_service.id}`)
  }

  return (
    <ProjectServiceFormCard
      onCancel={goBack}
      onSubmit={handleSubmit}
    />
  )
}

export default ProjectServiceCreatePage
