import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { FC, Fragment, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'

import AdminDoctorLanguagesAPI, {
  PayloadCreateDoctorLanguage,
  PayloadUpdateDoctorLanguage,
} from '@api/admin/teamLanguagesAPI'
import AdminDoctorsAPI, { ResponseDoctor } from '@api/admin/teamsAPI'

import { ID } from '@models/base'
import DoctorLanguageModel from '@models/doctorLanguage'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import LanguageTabDeleteButton from '@components/LanguageTabDeleteButton'
import LanguageTabSwitcher, { LanguageTab } from '@components/LanguageTabSwitcher'

import DoctorContentEditorCard from '@modules/doctor/components/DoctorContentEditorCard'
import DoctorDetailCard from '@modules/doctor/components/DoctorDetailCard/DoctorDetailCard'
import DoctorLanguageDetailCard from '@modules/doctor/components/DoctorLanguageDetailCard'
import DoctorLanguageFormModal, { DoctorLanguageFormShape } from '@modules/doctor/components/DoctorLanguageFormModal'
import DoctorThumbnailCard from '@modules/doctor/components/DoctorThumbnailCard'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

type Props = {}

const DoctorDetailPage: FC<Props> = () => {
  const queryClient = useQueryClient()
  const alert = useAlert()
  const toast = useToast()
  const intl = useIntl()
  const { doctorId } = useParams()
  const [isShowAddLanguageModal, , showAddLanguageModal, hideAddLanguageModal] = useBoolState(false)
  const [isShowEditLanguageModal, , showEditLanguageModal, hideEditLanguageModal] = useBoolState(false)
  const [activeLanguageIndex, setActiveLanguageIndex] = useState<number>(0)
  const [languageToEdit, setLanguageToEdit] = useState<DoctorLanguageModel>()

  const { data, error, refetch } = useQuery({
    queryKey: [QUERIES.DOCTOR_DETAIL, doctorId],
    queryFn: () => AdminDoctorsAPI.get(doctorId!),
    select: (response) => response.data.data?.doctor,
  })

  const updateLanguagesQuery = (languages: Array<DoctorLanguageModel>) => {
    queryClient.setQueryData<AxiosResponse<ResponseDoctor> | undefined>([QUERIES.DOCTOR_DETAIL, doctorId], (old) => {
      if (old?.data.data) {
        old.data.data.doctor.doctor_languages = languages
        return old
      }
    })
  }

  const updateLanguageQuery = (doctorLanguageId: ID, language: DoctorLanguageModel) => {
    queryClient.setQueryData<AxiosResponse<ResponseDoctor> | undefined>([QUERIES.DOCTOR_DETAIL, doctorId], (old) => {
      if (old?.data.data) {
        const languageIndex = old.data.data.doctor.doctor_languages.findIndex((dl) => dl.id === doctorLanguageId)
        if (languageIndex !== -1) {
          old.data.data.doctor.doctor_languages[languageIndex] = language
          return old
        }
      }
    })
  }

  const handleLanguageTabChange = (_: unknown, index: number) => {
    setActiveLanguageIndex(index)
  }

  const handleAddLanguage = async (values: DoctorLanguageFormShape) => {
    const payload = FormUtil.parseValues<PayloadCreateDoctorLanguage>(values)
    const response = await AdminDoctorLanguagesAPI.create({
      ...payload,
      doctor_id: doctorId!,
    })

    toast.success(intl.formatMessage({ id: 'doctor.alert.create_language_success' }))
    hideAddLanguageModal()

    if (response.data?.doctor_languages) {
      updateLanguagesQuery(response.data.doctor_languages)
    } else {
      refetch()
    }
  }

  const handleEditLanguage = async (values: DoctorLanguageFormShape) => {
    const payload = FormUtil.parseValues<PayloadUpdateDoctorLanguage>(values)
    const response = await AdminDoctorLanguagesAPI.update(languageToEdit?.id!, payload)

    toast.success(intl.formatMessage({ id: 'doctor.alert.update_language_success' }))
    hideEditLanguageModal()

    if (response.data?.doctor_languages) {
      updateLanguagesQuery(response.data.doctor_languages)
    } else {
      refetch()
    }
  }

  const handleDeleteLanguage = async (doctorLanguageId: ID, index: number) => {
    try {
      const { isConfirmed } = await alert.warning({
        text: intl.formatMessage({ id: 'doctor.alert.delete_doctor_language_prompt' }),
        confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
      })

      if (isConfirmed) {
        const response = await AdminDoctorLanguagesAPI.delete(doctorLanguageId)

        // realign active language index
        if (index <= activeLanguageIndex) {
          setActiveLanguageIndex((prev) => (prev > 0 ? prev - 1 : prev))
        }

        if (response.data?.doctor_languages) {
          updateLanguagesQuery(response.data.doctor_languages)
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

  const handleEditLanguageButtonClick = (doctorLanguage: DoctorLanguageModel) => {
    setLanguageToEdit(doctorLanguage)
    showEditLanguageModal()
  }

  const handleLanguageContentChange = async (doctorLanguageId: ID, content: string) => {
    try {
      const response = await AdminDoctorLanguagesAPI.setContent(doctorLanguageId, { content })

      toast.success(intl.formatMessage({ id: 'doctor.alert.update_language_content_success' }))

      if (response.data?.doctor_language) {
        updateLanguageQuery(doctorLanguageId, response.data.doctor_language)
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
    const activeLanguage = data.doctor_languages[activeLanguageIndex]

    const languages = data.doctor_languages.map<LanguageTab>((content, index) => ({
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
            <DoctorDetailCard
              slug={data.slug}
              name={data.name}
              jobTitle={data.job_title}
              image={data.image_file.link}
              degree={data.degree}
              location={data.location ? data.location.name : null}
              isActive={data.is_active}
              startPracticeMonth={data.start_practice_month}
              startPracticeYear={data.start_practice_year}
              toolbar={
                <PermissionsControl allow={PermissionEnum.ADMIN_ARTICLE_UPDATE}>
                  <Link
                    className="btn btn-primary"
                    to={`/admin/doctors/edit/${data.id}`}
                  >
                    <i className="fa-solid fa-pen" />
                    <FormattedMessage id="doctor.button.edit_doctor" />
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
                      <PermissionsControl allow={[PermissionEnum.ADMIN_DOCTOR_LANGUAGE_CREATE]}>
                        <Button
                          theme="primary"
                          onClick={showAddLanguageModal}
                        >
                          <i className="fa-solid fa-plus" />
                          <FormattedMessage id="doctor.button.add_language" />
                        </Button>
                      </PermissionsControl>
                    )}
                  </div>
                </div>

                <DoctorLanguageDetailCard
                  quote={activeLanguage.quote}
                  quoteAuthor={activeLanguage.quote_author}
                  toolbar={
                    <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_LANGUAGE_UPDATE]}>
                      <Button
                        theme="primary"
                        onClick={() => handleEditLanguageButtonClick(activeLanguage)}
                      >
                        <i className="fa-solid fa-pen" />
                        <FormattedMessage id="doctor.button.edit_language" />
                      </Button>
                    </PermissionsControl>
                  }
                />

                <DoctorContentEditorCard
                  key={activeLanguage.id}
                  defaultContent={activeLanguage.content}
                  onChange={(content) => handleLanguageContentChange(activeLanguage.id, content)}
                />
              </Fragment>
            ) : (
              <EmptyContentCard title={<FormattedMessage id="doctor.placeholder.empty_language_title" />}>
                <PermissionsControl allow={[PermissionEnum.ADMIN_DOCTOR_LANGUAGE_CREATE]}>
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
            <DoctorThumbnailCard
              imageSrc={data.thumbnail_file.link}
              toolbar={
                <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_UPDATE]}>
                  <Link
                    className="btn btn-secondary btn-icon btn-sm"
                    to={`/admin/doctors/edit/${data.id}`}
                  >
                    <i className="fa-solid fa-pen" />
                  </Link>
                </PermissionsControl>
              }
            />
          </Col>
        </Row>

        <DoctorLanguageFormModal
          title={<FormattedMessage id="doctor.modal.add_language_title" />}
          doctorId={data.id}
          isShow={isShowAddLanguageModal}
          onCancel={hideAddLanguageModal}
          onSubmit={handleAddLanguage}
        />

        {languageToEdit && (
          <DoctorLanguageFormModal
            title={<FormattedMessage id="doctor.modal.edit_language_title" />}
            doctorId={data.id}
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

export default DoctorDetailPage
