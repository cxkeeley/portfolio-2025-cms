import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminProjectsAPI, { PayloadAdminProjectCreate } from '@api/admin/projectsAPI'

import { ProjectFormCard, ProjectFormCardShape } from '@modules/project/components/ProjectFormCard'

import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

const ProjectCreatePage: FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  const handleSubmit = async (values: ProjectFormCardShape) => {
    const payload = FormUtil.formatValues(FormUtil.parseValues<PayloadAdminProjectCreate>(values), {
      latitude: (v) => (TypeUtil.isDefined(v) ? Number(v) : null),
      longitude: (v) => (TypeUtil.isDefined(v) ? Number(v) : null),
    })

    const response = await AdminProjectsAPI.create(payload)
    toast.success(intl.formatMessage({ id: 'project.alert.create_project_success' }))

    if (response.data.data?.project) {
      navigate(`/admin/projects/${response.data.data.project.id}`)
    } else {
      goBack()
    }
  }

  return (
    <ProjectFormCard
      onSubmit={handleSubmit}
      onCancel={goBack}
    />
  )
}

export default ProjectCreatePage
