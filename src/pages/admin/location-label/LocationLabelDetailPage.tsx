import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Col, Row, Stack } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import AdminLocationLabelLanguageAPI, {
  PayloadLocationLabelLanguageCreate,
  PayloadLocationLabelLanguageUpdate,
} from '@api/admin/locationLabelLanguagesAPI'
import AdminLocationLabelsAPI, { PayloadUpdateLocationLabelMapIcon } from '@api/admin/projectLabelsAPI'

import { LanguageCodeEnum } from '@models/language'
import { LocationLabelLanguageModel } from '@models/locationLabelLanguage'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import LanguageTabDeleteButton from '@components/LanguageTabDeleteButton'
import LanguageTabSwitcher, { LanguageTab } from '@components/LanguageTabSwitcher'

import LocationLabelImageCard from '@modules/location-label/components/LocationLabelImageCard'
import LocationLabelLanguageDetailCard from '@modules/location-label/components/LocationLabelLanguageDetailCard'
import LocationLabelLanguageFormModal, {
  LocationLabelLanguageFormModalShape,
} from '@modules/location-label/components/LocationLabelLanguageFormModal/LocationLabelLanguageFormModal'
import LocationLabelUpdateFormModal, {
  LocationLabelUpdateFormModalShape,
} from '@modules/location-label/components/LocationLabelUpdateFormModal'
import { PermissionsControl } from '@modules/permissions'

import { DEFAULT_LANGUAGE } from '@/constants/constant'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

const LocationLabelDetailPage: React.FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const { locationLabelId } = useParams()
  const [isShowEditModal, , showEditModal, hideEditModal] = useBoolState()
  const [isShowCreateLanguageModal, , showCreateLanguageModal, hideCreateLanguageModal] = useBoolState()
  const [isShowEditLanguageModal, , showEditLanguageModal, hideEditLanguageModal] = useBoolState()
  const [activeLanguageIndex, setActiveLanguageIndex] = React.useState(0)

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    enabled: TypeUtil.isDefined(locationLabelId),
    queryKey: [QUERIES.ADMIN_LOCATION_LABEL_DETAIL, { locationLabelId }],
    queryFn: () => AdminLocationLabelsAPI.get(locationLabelId!),
    select: (response) => response.data.data?.location_label,
  })

  const handleLanguageTabChange = (_: unknown, index: number) => {
    setActiveLanguageIndex(index)
  }

  const handleSubmitEditFormModal = async (values: LocationLabelUpdateFormModalShape) => {
    const payload = FormUtil.formatValues(FormUtil.parseValues<PayloadUpdateLocationLabelMapIcon>(values), {
      map_icon_file_path: (v) => v ?? null,
    })
    await AdminLocationLabelsAPI.updateMapIcon(locationLabelId!, payload)

    refetch()
    hideEditModal()
  }

  const handleSubmitCreateLanguageFormModal = async (values: LocationLabelLanguageFormModalShape) => {
    const payload = FormUtil.formatValues<PayloadLocationLabelLanguageCreate>(FormUtil.parseValues(values), {
      location_label_id: () => locationLabelId!,
    })
    await AdminLocationLabelLanguageAPI.create(payload).then((r) => r.data)

    toast.success(intl.formatMessage({ id: 'location_label.message.create_language_success' }))
    refetch()
    hideCreateLanguageModal()
  }

  const handleSubmitEditLanguageFormModal = async (
    values: LocationLabelLanguageFormModalShape,
    language: LocationLabelLanguageModel
  ) => {
    const payload = FormUtil.parseValues<PayloadLocationLabelLanguageUpdate>(values)
    await AdminLocationLabelLanguageAPI.update(language.id, payload).then((r) => r.data)

    toast.success(intl.formatMessage({ id: 'location_label.message.update_language_success' }))
    refetch()
    hideEditLanguageModal()
  }

  const deleteLanguage = React.useCallback(
    async (language: LocationLabelLanguageModel, index: number) => {
      try {
        const { isConfirmed } = await alert.question({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: language.language?.name }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })

        if (isConfirmed) {
          await AdminLocationLabelLanguageAPI.delete(language.id)

          refetch()

          // realign active language index
          if (index <= activeLanguageIndex) {
            setActiveLanguageIndex((prev) => (prev > 0 ? prev - 1 : prev))
          }

          toast.success(intl.formatMessage({ id: 'location_label.message.delete_language_success' }))
        }
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

  const languages = React.useMemo<Array<LanguageTab>>(() => {
    if (data && data.location_label_languages) {
      return data.location_label_languages
        .filter((language) => TypeUtil.isDefined(language.language))
        .map<LanguageTab>((language, i) => ({
          id: language.language!.id,
          code: language.language!.code,
          name: language.language!.name,
          toolbar: language.language!.code !== DEFAULT_LANGUAGE && (
            <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_LABEL_LANGUAGE_DELETE}>
              <LanguageTabDeleteButton
                onClick={(e) => {
                  e.stopPropagation()
                  deleteLanguage(language, i)
                }}
              />
            </PermissionsControl>
          ),
        }))
    }
    return []
  }, [data, deleteLanguage])

  if (data) {
    const activeLanguage = data.location_label_languages?.at(activeLanguageIndex)
    const canAddLanguage = languages.length < Object.values(LanguageCodeEnum).length
    const hasLanguages = languages.length > 0

    return (
      <React.Fragment>
        <Row>
          <Col
            xs={12}
            md={6}
            lg={7}
            xl={8}
          >
            {hasLanguages ? (
              <React.Fragment>
                <div className="mb-6">
                  <div className="d-flex align-items-center gap-4">
                    <LanguageTabSwitcher
                      current={activeLanguage?.language ?? null}
                      tabs={languages}
                      onChange={handleLanguageTabChange}
                    />

                    {canAddLanguage && (
                      <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_LABEL_LANGUAGE_CREATE}>
                        <Button
                          theme="primary"
                          onClick={showCreateLanguageModal}
                          disabled={!canAddLanguage}
                        >
                          <i className="fa-solid fa-plus" />
                          <FormattedMessage id="location_label.button.add_language" />
                        </Button>
                      </PermissionsControl>
                    )}
                  </div>
                </div>

                {activeLanguage && (
                  <React.Fragment>
                    <LocationLabelLanguageDetailCard
                      name={activeLanguage.default_name}
                      updatedAt={activeLanguage.updated_at}
                      cardTitle={<FormattedMessage id="vocabulary.detail" />}
                      cardToolbar={
                        <Stack
                          direction="horizontal"
                          gap={3}
                        >
                          <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_LABEL_LANGUAGE_UPDATE}>
                            <Button
                              theme="primary"
                              variant="light"
                              onClick={showEditLanguageModal}
                            >
                              <i className="fa-solid fa-pen" />
                              <FormattedMessage id="vocabulary.edit" />
                            </Button>
                          </PermissionsControl>
                        </Stack>
                      }
                    />
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : (
              <EmptyContentCard title={<FormattedMessage id="location_label.message.empty_language_placeholder" />}>
                <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_LABEL_LANGUAGE_CREATE}>
                  <Button
                    theme="primary"
                    onClick={showCreateLanguageModal}
                    disabled={!canAddLanguage}
                  >
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="location_label.button.add_language" />
                  </Button>
                </PermissionsControl>
              </EmptyContentCard>
            )}
          </Col>

          <Col
            xs={12}
            md={6}
            lg={5}
            xl={4}
          >
            <LocationLabelImageCard
              cardTitle={<FormattedMessage id="vocabulary.icon" />}
              imageSrc={data.map_icon_file ? data.map_icon_file.link : null}
              toolbar={
                <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_LABEL_UPDATE_MAP_ICON}>
                  <Button
                    size="sm"
                    variant="icon"
                    theme="primary"
                    onClick={showEditModal}
                  >
                    <i className="fa-solid fa-pen" />
                  </Button>
                </PermissionsControl>
              }
            />
          </Col>
        </Row>

        <LocationLabelUpdateFormModal
          modalTitle={<FormattedMessage id="location_label.modal.modal_edit_title" />}
          isShow={isShowEditModal}
          onCancel={hideEditModal}
          onSubmit={handleSubmitEditFormModal}
        />

        <LocationLabelLanguageFormModal
          modalTitle={<FormattedMessage id="location_label.modal.modal_create_language_title" />}
          isShow={isShowCreateLanguageModal}
          locationLabelId={data.id}
          onHide={hideCreateLanguageModal}
          onCancel={hideCreateLanguageModal}
          onSubmit={handleSubmitCreateLanguageFormModal}
        />

        {activeLanguage && (
          <LocationLabelLanguageFormModal
            modalTitle={<FormattedMessage id="location_label.modal.modal_edit_language_title" />}
            isShow={isShowEditLanguageModal}
            locationLabelId={data.id}
            disabledFields={{
              language_id: true,
            }}
            initialValues={{
              name: activeLanguage.default_name,
              language_id: activeLanguage.language ? Option.fromObject(activeLanguage.language, 'id', 'name') : null,
            }}
            onHide={hideEditLanguageModal}
            onCancel={hideEditLanguageModal}
            onSubmit={(values) => handleSubmitEditLanguageFormModal(values, activeLanguage)}
          />
        )}
      </React.Fragment>
    )
  }

  if (isFetching && isLoading) {
    return <FloatLoadingIndicator />
  }

  if (isError) {
    return <ErrorCard />
  }

  return null
}

export default LocationLabelDetailPage
