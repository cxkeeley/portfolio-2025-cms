import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'

import AdminProjectLanguagesAPI, {
  PayloadAdminProjectLanguageCreate,
  PayloadAdminProjectLanguageUpdate,
} from '@api/admin/projectLanguagesAPI'
import AdminProjectsAPI from '@api/admin/projectsAPI'

import { LanguageCodeEnum } from '@models/language'
import { Option } from '@models/option'
import { ProjectLanguageModel } from '@models/projectLanguage'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import LanguageTabDeleteButton from '@components/LanguageTabDeleteButton'
import LanguageTabSwitcher, { LanguageTab } from '@components/LanguageTabSwitcher'

import { PermissionsControl } from '@modules/permissions'
import ProjectContentCard from '@modules/project/components/ProjectContentCard'
import { ProjectDetailCard } from '@modules/project/components/ProjectDetailCard'
import ProjectFeaturedImageCard from '@modules/project/components/ProjectFeaturedImageCard/ProjectFeaturedImageCard'
import ProjectLanguageDetailCard from '@modules/project/components/ProjectLanguageDetailCard/ProjectLanguageDetailCard'
import ProjectLanguageFormModal, {
  ProjectLanguageFormModalShape,
} from '@modules/project/components/ProjectLanguageFormModal'

import { DEFAULT_LANGUAGE } from '@/constants/constant'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

const ProjectDetailPage: React.FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const alert = useAlert()
  const { projectId } = useParams()
  const [activeLanguageIndex, setActiveLanguageIndex] = React.useState(0)
  const [isShowCreateLanguageModal, , showCreateLanguageModal, hideCreateLanguageModal] = useBoolState(false)
  const [isShowEditLanguageModal, , showEditLanguageModal, hideEditLanguageModal] = useBoolState(false)

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    enabled: TypeUtil.isDefined(projectId),
    queryKey: [QUERIES.ADMIN_PROJECT_DETAIL, { projectId }],
    queryFn: () => AdminProjectsAPI.get(projectId!),
    select: (r) => r.data.data?.project,
  })

  const handleSubmitCreateLanguage = async (values: ProjectLanguageFormModalShape) => {
    const payload = FormUtil.parseValues<PayloadAdminProjectLanguageCreate>(values)
    await AdminProjectLanguagesAPI.create({
      ...payload,
      project_id: projectId!,
    })

    toast.success(intl.formatMessage({ id: 'project.message.create_language_success' }))
    refetch()
    hideCreateLanguageModal()
  }

  const handleSubmitEditLanguage = async (values: ProjectLanguageFormModalShape, language: ProjectLanguageModel) => {
    const payload = FormUtil.parseValues<PayloadAdminProjectLanguageUpdate>(values)
    await AdminProjectLanguagesAPI.update(language.id, payload)

    toast.success(intl.formatMessage({ id: 'project.message.update_language_success' }))
    refetch()
    hideEditLanguageModal()
  }

  const deleteLanguage = React.useCallback(
    async (language: ProjectLanguageModel, index: number) => {
      try {
        const { isConfirmed } = await alert.question({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: language.language?.name }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })
        if (!isConfirmed) return

        await AdminProjectLanguagesAPI.delete(language.id)
        refetch()
        // realign active language index
        if (index <= activeLanguageIndex) {
          setActiveLanguageIndex((prev) => (prev > 0 ? prev - 1 : prev))
        }
        toast.success(intl.formatMessage({ id: 'project.message.delete_language_success' }))
      } catch (err) {
        if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
          alert.error({ text: err.response.data.message })
        } else {
          alert.error({ text: String(err) })
        }
      }
    },
    [activeLanguageIndex, alert, intl, refetch, toast]
  )

  const languages = React.useMemo(() => {
    if (data && data.languages) {
      return data.languages
        .filter((language) => TypeUtil.isDefined(language.language))
        .map<LanguageTab>((language, index) => ({
          id: language.language!.id,
          code: language.language!.code,
          name: language.language!.name,
          toolbar: language.language!.code !== DEFAULT_LANGUAGE && (
            <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_LANGUAGE_DELETE}>
              <LanguageTabDeleteButton onClick={() => deleteLanguage(language, index)} />
            </PermissionsControl>
          ),
        }))
    }
    return []
  }, [data, deleteLanguage])

  if (data) {
    const activeLanguage = data.languages?.at(activeLanguageIndex)
    const hasLanguages = data.languages && data.languages.length > 0
    const canAddLanguage = data.languages && data.languages.length < Object.values(LanguageCodeEnum).length

    return (
      <React.Fragment>
        <Row>
          <Col
            xs={12}
            xl={8}
          >
            <ProjectDetailCard
              cardTitle={<FormattedMessage id="project.section.card_general_title" />}
              address={data.address}
              phoneNumber={data.phone_number}
              projectGroupName={data.project_group ? data.project_group.name : ''}
              projectLabel={data.project_label ? data.project_label.default_name : ''}
              isComingSoon={data.is_coming_soon}
              latitude={data.latitude}
              longitude={data.longitude}
              updatedAt={data.updated_at}
              cardToolbar={
                <PermissionsControl allow={[PermissionEnum.ADMIN_PROJECT_UPDATE]}>
                  <Link
                    to={`/admin/projects/edit/${projectId}`}
                    className="btn btn-light-primary"
                  >
                    <i className="fa-solid fa-pen me-1" />
                    <FormattedMessage id="article.button.edit" />
                  </Link>
                </PermissionsControl>
              }
            />

            {hasLanguages ? (
              <React.Fragment>
                <div className="mb-6">
                  <div className="d-flex align-items-center gap-4">
                    <LanguageTabSwitcher
                      current={activeLanguage?.language ?? null}
                      tabs={languages}
                      onChange={(_, index) => setActiveLanguageIndex(index)}
                    />

                    {canAddLanguage && (
                      <PermissionsControl allow={PermissionEnum.ADMIN_PROJECT_LANGUAGE_CREATE}>
                        <Button
                          theme="primary"
                          onClick={showCreateLanguageModal}
                          disabled={!canAddLanguage}
                        >
                          <i className="fa-solid fa-plus" />
                          <FormattedMessage id="project_group.button.add_language" />
                        </Button>
                      </PermissionsControl>
                    )}
                  </div>
                </div>

                {activeLanguage && (
                  <React.Fragment>
                    <ProjectLanguageDetailCard
                      name={activeLanguage.name}
                      address={activeLanguage.address}
                      description={activeLanguage.description}
                      shortName={activeLanguage.short_name}
                      slug={activeLanguage.slug}
                      updatedAt={activeLanguage.updated_at}
                      cardTitle={<FormattedMessage id="project_group.section.card_detail_title" />}
                      cardToolbar={
                        <PermissionsControl allow={PermissionEnum.ADMIN_PROJECT_LANGUAGE_UPDATE}>
                          <Button
                            theme="primary"
                            variant="light"
                            onClick={showEditLanguageModal}
                          >
                            <i className="fa-solid fa-pen" />
                            <FormattedMessage id="vocabulary.edit" />
                          </Button>
                        </PermissionsControl>
                      }
                    />
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : (
              <EmptyContentCard title={<FormattedMessage id="project.message.empty_language_placeholder" />}>
                <PermissionsControl allow={PermissionEnum.ADMIN_PROJECT_LANGUAGE_CREATE}>
                  <Button
                    theme="primary"
                    onClick={showCreateLanguageModal}
                    disabled={!canAddLanguage}
                  >
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="project.button.add_language" />
                  </Button>
                </PermissionsControl>
              </EmptyContentCard>
            )}

            <ProjectContentCard projectId={data.id} />
          </Col>

          <Col
            xs={12}
            xl={4}
          >
            <ProjectFeaturedImageCard
              cardTitle={<FormattedMessage id="project.section.card_image_title" />}
              imageSrc={data.image_file ? data.image_file.link : null}
            />
          </Col>
        </Row>

        <ProjectLanguageFormModal
          isShow={isShowCreateLanguageModal}
          modalTitle={<FormattedMessage id="project.modal.add_language_title" />}
          hiddenFields={{
            slug: true,
          }}
          projectId={data.id}
          onHide={hideCreateLanguageModal}
          onCancel={hideCreateLanguageModal}
          onSubmit={handleSubmitCreateLanguage}
        />

        {activeLanguage && (
          <ProjectLanguageFormModal
            isShow={isShowEditLanguageModal}
            modalTitle={<FormattedMessage id="project.modal.edit_language_title" />}
            disabledFields={{
              language_id: true,
            }}
            initialValues={{
              slug: activeLanguage.slug,
              address: activeLanguage.address,
              description: activeLanguage.description,
              name: activeLanguage.name,
              short_name: activeLanguage.short_name,
              language_id: activeLanguage.language ? Option.fromObject(activeLanguage.language, 'id', 'name') : null,
            }}
            projectId={data.id}
            onHide={hideEditLanguageModal}
            onCancel={hideEditLanguageModal}
            onSubmit={(values) => handleSubmitEditLanguage(values, activeLanguage)}
          />
        )}
      </React.Fragment>
    )
  }

  if (isFetching || isLoading) {
    return <FloatLoadingIndicator />
  }

  if (error) {
    return <ErrorCard />
  }

  return null
}

export default ProjectDetailPage
