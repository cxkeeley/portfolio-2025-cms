import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { FC, Fragment, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'

import AdminTeamLanguagesAPI, {
  PayloadCreateTeamLanguage,
  PayloadUpdateTeamLanguage,
} from '@api/admin/teamLanguagesAPI'
import AdminTeamsAPI, { ResponseTeam } from '@api/admin/teamsAPI'

import { ID } from '@models/base'
import TeamLanguageModel from '@models/teamLanguage'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import LanguageTabDeleteButton from '@components/LanguageTabDeleteButton'
import LanguageTabSwitcher, { LanguageTab } from '@components/LanguageTabSwitcher'

import TeamContentEditorCard from '@modules/team/components/TeamContentEditorCard'
import TeamDetailCard from '@modules/team/components/TeamDetailCard/TeamDetailCard'
import TeamLanguageDetailCard from '@modules/team/components/TeamLanguageDetailCard'
import TeamLanguageFormModal, { TeamLanguageFormShape } from '@modules/team/components/TeamLanguageFormModal'
import TeamThumbnailCard from '@modules/team/components/TeamThumbnailCard'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

type Props = {}

const TeamDetailPage: FC<Props> = () => {
  const queryClient = useQueryClient()
  const alert = useAlert()
  const toast = useToast()
  const intl = useIntl()
  const { teamId } = useParams()
  const [isShowAddLanguageModal, , showAddLanguageModal, hideAddLanguageModal] = useBoolState(false)
  const [isShowEditLanguageModal, , showEditLanguageModal, hideEditLanguageModal] = useBoolState(false)
  const [activeLanguageIndex, setActiveLanguageIndex] = useState<number>(0)
  const [languageToEdit, setLanguageToEdit] = useState<TeamLanguageModel>()

  const { data, error, refetch } = useQuery({
    queryKey: [QUERIES.TEAM_DETAIL, teamId],
    queryFn: () => AdminTeamsAPI.get(teamId!),
    select: (response) => response.data.data?.team,
  })

  const updateLanguagesQuery = (languages: Array<TeamLanguageModel>) => {
    queryClient.setQueryData<AxiosResponse<ResponseTeam> | undefined>([QUERIES.TEAM_DETAIL, teamId], (old) => {
      if (old?.data.data) {
        old.data.data.team.team_languages = languages
        return old
      }
    })
  }

  const updateLanguageQuery = (teamLanguageId: ID, language: TeamLanguageModel) => {
    queryClient.setQueryData<AxiosResponse<ResponseTeam> | undefined>([QUERIES.TEAM_DETAIL, teamId], (old) => {
      if (old?.data.data) {
        const languageIndex = old.data.data.team.team_languages.findIndex((dl) => dl.id === teamLanguageId)
        if (languageIndex !== -1) {
          old.data.data.team.team_languages[languageIndex] = language
          return old
        }
      }
    })
  }

  const handleLanguageTabChange = (_: unknown, index: number) => {
    setActiveLanguageIndex(index)
  }

  const handleAddLanguage = async (values: TeamLanguageFormShape) => {
    const payload = FormUtil.parseValues<PayloadCreateTeamLanguage>(values)
    const response = await AdminTeamLanguagesAPI.create({
      ...payload,
      team_id: teamId!,
    })

    toast.success(intl.formatMessage({ id: 'team.alert.create_language_success' }))
    hideAddLanguageModal()

    if (response.data?.team_languages) {
      updateLanguagesQuery(response.data.team_languages)
    } else {
      refetch()
    }
  }

  const handleEditLanguage = async (values: TeamLanguageFormShape) => {
    const payload = FormUtil.parseValues<PayloadUpdateTeamLanguage>(values)
    const response = await AdminTeamLanguagesAPI.update(languageToEdit?.id!, payload)

    toast.success(intl.formatMessage({ id: 'team.alert.update_language_success' }))
    hideEditLanguageModal()

    if (response.data?.team_languages) {
      updateLanguagesQuery(response.data.team_languages)
    } else {
      refetch()
    }
  }

  const handleDeleteLanguage = async (teamLanguageId: ID, index: number) => {
    try {
      const { isConfirmed } = await alert.warning({
        text: intl.formatMessage({ id: 'team.alert.delete_team_language_prompt' }),
        confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
      })

      if (isConfirmed) {
        const response = await AdminTeamLanguagesAPI.delete(teamLanguageId)

        // realign active language index
        if (index <= activeLanguageIndex) {
          setActiveLanguageIndex((prev) => (prev > 0 ? prev - 1 : prev))
        }

        if (response.data?.team_languages) {
          updateLanguagesQuery(response.data.team_languages)
        } else {
          refetch()
        }
      }
    } catch (err) {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    }
  }

  const handleEditLanguageButtonClick = (teamLanguage: TeamLanguageModel) => {
    setLanguageToEdit(teamLanguage)
    showEditLanguageModal()
  }

  const handleLanguageContentChange = async (teamLanguageId: ID, content: string) => {
    try {
      const response = await AdminTeamLanguagesAPI.setContent(teamLanguageId, { content })

      toast.success(intl.formatMessage({ id: 'team.alert.update_language_content_success' }))

      if (response.data?.team_language) {
        updateLanguageQuery(teamLanguageId, response.data.team_language)
      } else {
        refetch()
      }
    } catch (err) {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    }
  }

  if (error) {
    return <ErrorCard />
  }

  if (data) {
    const activeLanguage = data.team_languages[activeLanguageIndex]

    const languages = data.team_languages.map<LanguageTab>((content, index) => ({
      id: content.id,
      code: content.language.code,
      name: content.language.name,
      toolbar: (
        <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_LANGUAGE_DELETE]}>
          <LanguageTabDeleteButton onClick={() => handleDeleteLanguage(content.id, index)} />
        </PermissionsControl>
      ),
    }))

    return (
      <Fragment>
        <Row>
          <Col lg={9}>
            <TeamDetailCard
              slug={data.slug}
              name={data.name}
              jobTitle={data.job_title}
              image={data.image_file.link}
              degree={data.degree}
              project={data.project ? data.project.name : null}
              isActive={data.is_active}
              startPracticeMonth={data.start_practice_month}
              startPracticeYear={data.start_practice_year}
              toolbar={
                <PermissionsControl allow={PermissionEnum.ADMIN_ARTICLE_UPDATE}>
                  <Link
                    className="btn btn-primary"
                    to={`/admin/teams/edit/${data.id}`}
                  >
                    <i className="fa-solid fa-pen" />
                    <FormattedMessage id="team.button.edit_team" />
                  </Link>
                </PermissionsControl>
              }
            />

            {languages.length > 0 ? (
              <Fragment>
                <div className="mb-6">
                  <div className="d-flex align-items-center gap-4">
                    <LanguageTabSwitcher
                      current={activeLanguage.language}
                      tabs={languages}
                      onChange={handleLanguageTabChange}
                    />

                    {languages.length < 2 && (
                      <PermissionsControl allow={[PermissionEnum.ADMIN_TEAM_LANGUAGE_CREATE]}>
                        <Button
                          theme="primary"
                          onClick={showAddLanguageModal}
                        >
                          <i className="fa-solid fa-plus" />
                          <FormattedMessage id="team.button.add_language" />
                        </Button>
                      </PermissionsControl>
                    )}
                  </div>
                </div>

                <TeamLanguageDetailCard
                  quote={activeLanguage.quote}
                  quoteAuthor={activeLanguage.quote_author}
                  toolbar={
                    <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_LANGUAGE_UPDATE]}>
                      <Button
                        theme="primary"
                        onClick={() => handleEditLanguageButtonClick(activeLanguage)}
                      >
                        <i className="fa-solid fa-pen" />
                        <FormattedMessage id="team.button.edit_language" />
                      </Button>
                    </PermissionsControl>
                  }
                />

                <TeamContentEditorCard
                  key={activeLanguage.id}
                  defaultContent={activeLanguage.content}
                  onChange={(content) => handleLanguageContentChange(activeLanguage.id, content)}
                />
              </Fragment>
            ) : (
              <EmptyContentCard title={<FormattedMessage id="team.placeholder.empty_language_title" />}>
                <PermissionsControl allow={[PermissionEnum.ADMIN_TEAM_LANGUAGE_CREATE]}>
                  <Button
                    theme="primary"
                    onClick={showAddLanguageModal}
                  >
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="article.button.add_language" />
                  </Button>
                </PermissionsControl>
              </EmptyContentCard>
            )}
          </Col>

          <Col lg={3}>
            <TeamThumbnailCard
              imageSrc={data.thumbnail_file.link}
              toolbar={
                <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_UPDATE]}>
                  <Link
                    className="btn btn-secondary btn-icon btn-sm"
                    to={`/admin/teams/edit/${data.id}`}
                  >
                    <i className="fa-solid fa-pen" />
                  </Link>
                </PermissionsControl>
              }
            />
          </Col>
        </Row>

        <TeamLanguageFormModal
          title={<FormattedMessage id="team.modal.add_language_title" />}
          teamId={data.id}
          isShow={isShowAddLanguageModal}
          onCancel={hideAddLanguageModal}
          onSubmit={handleAddLanguage}
        />

        {languageToEdit && (
          <TeamLanguageFormModal
            title={<FormattedMessage id="team.modal.edit_language_title" />}
            teamId={data.id}
            isShow={isShowEditLanguageModal}
            initialValues={{
              language_id: new Option({
                label: languageToEdit.language.name,
                value: languageToEdit.language_id,
              }),
              quote: languageToEdit.quote,
              quote_author: languageToEdit.quote_author,
            }}
            onCancel={hideEditLanguageModal}
            onSubmit={handleEditLanguage}
            onExited={() => setLanguageToEdit(undefined)}
          />
        )}
      </Fragment>
    )
  }

  return <FloatLoadingIndicator />
}

export default TeamDetailPage
