import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import AdminProjectsAPI, { PayloadAdminProjectUpdate } from '@api/admin/projectsAPI'

import { Option } from '@models/option'

import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import { ProjectFormCard, ProjectFormCardShape } from '@modules/project/components/ProjectFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

const ProjectEditPage: FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()
  const { projectId } = useParams()

  const { data, error, isLoading, isFetching } = useQuery({
    enabled: TypeUtil.isDefined(projectId),
    queryKey: [QUERIES.ADMIN_PROJECT_DETAIL, projectId],
    queryFn: () => AdminProjectsAPI.get(projectId!),
    select: (r) => r.data.data?.project,
  })

  const goBack = () => {
    navigate(-1)
  }

  const handleSubmit = async (values: ProjectFormCardShape) => {
    const payload = FormUtil.formatValues(FormUtil.parseValues<PayloadAdminProjectUpdate>(values), {
      latitude: (v) => (TypeUtil.isDefined(v) ? Number(v) : null),
      longitude: (v) => (TypeUtil.isDefined(v) ? Number(v) : null),
    })
    await AdminProjectsAPI.update(projectId!, payload)

    toast.success(intl.formatMessage({ id: 'project.alert.update_project_success' }))
    navigate(`/admin/projects/${projectId}`)
  }

  if (data) {
    return (
      <ProjectFormCard
        hiddenFields={{
          default_address: true,
          default_description: true,
          default_name: true,
          default_short_name: true,
        }}
        initialValues={{
          project_group_id: data.project_group ? Option.fromObject(data.project_group, 'id', 'name') : null,
          project_label_id: data.project_label ? Option.fromObject(data.project_label, 'id', 'default_name') : null,
          phone_number: data.phone_number,
          is_coming_soon: data.is_coming_soon,
          latitude: data.latitude,
          longitude: data.longitude,
        }}
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
    )
  }

  if (isLoading || isFetching) {
    return <FloatLoadingIndicator />
  }

  if (error) {
    return <ErrorCard />
  }

  return null
}

export default ProjectEditPage
