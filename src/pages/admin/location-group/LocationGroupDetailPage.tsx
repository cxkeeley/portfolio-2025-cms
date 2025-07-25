import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Col, Row, Stack } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import AdminLocationGroupLanguagesAPI, {
  PayloadLocationGroupLanguageCreate,
  PayloadLocationGroupLanguageUpdate,
} from '@api/admin/projectGroupLanguagesAPI'
import AdminLocationGroupsAPI, { PayloadLocationGroupUpdateImage } from '@api/admin/projectGroupsAPI'

import { LanguageCodeEnum } from '@models/language'
import { LocationGroupLanguageModel } from '@models/locationGroupLanguage'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import LanguageTabDeleteButton from '@components/LanguageTabDeleteButton'
import LanguageTabSwitcher, { LanguageTab } from '@components/LanguageTabSwitcher'

import LocationGroupImageCard from '@modules/location-group/components/LocationGroupImageCard'
import LocationGroupLanguageDetailCard from '@modules/location-group/components/LocationGroupLanguageDetailCard'
import LocationGroupLanguageFormModal, {
  LocationGroupLanguageFormModalShape,
} from '@modules/location-group/components/LocationGroupLanguageFormModal'
import LocationGroupUpdateFormModal, {
  LocationGroupUpdateFormModalShape,
} from '@modules/location-group/components/LocationGroupUpdateFormModal/LocationGroupUpdateFormModal'
import { PermissionsControl } from '@modules/permissions'

import { DEFAULT_LANGUAGE } from '@/constants/constant'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

const LocationGroupDetailPage: React.FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const { locationGroupId } = useParams()
  const [isShowEditModal, , showEditModal, hideEditModal] = useBoolState()
  const [isShowCreateLanguageModal, , showCreateLanguageModal, hideCreateLanguageModal] = useBoolState()
  const [isShowEditLanguageModal, , showEditLanguageModal, hideEditLanguageModal] = useBoolState()
  const [activeLanguageIndex, setActiveLanguageIndex] = React.useState(0)

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    enabled: TypeUtil.isDefined(locationGroupId),
    queryKey: [QUERIES.ADMIN_LOCATION_GROUP_DETAIL, { locationGroupId }],
    queryFn: () => AdminLocationGroupsAPI.get(locationGroupId!),
    select: (response) => response.data.data?.location_group,
  })

  const handleLanguageTabChange = (_: unknown, index: number) => {
    setActiveLanguageIndex(index)
  }

  const handleSubmitEditFormModal = async (values: LocationGroupUpdateFormModalShape) => {
    const payload = FormUtil.formatValues(FormUtil.parseValues<PayloadLocationGroupUpdateImage>(values), {
      image_file_path: (v) => v ?? null,
    })
    await AdminLocationGroupsAPI.updateImage(locationGroupId!, payload)

    refetch()
    hideEditModal()
  }

  const handleSubmitCreateLanguageFormModal = async (values: LocationGroupLanguageFormModalShape) => {
    const payload = FormUtil.formatValues<PayloadLocationGroupLanguageCreate>(FormUtil.parseValues(values), {
      location_group_id: () => locationGroupId!,
    })
    await AdminLocationGroupLanguagesAPI.create(payload).then((r) => r.data)

    toast.success(intl.formatMessage({ id: 'location_group.message.create_language_success' }))
    refetch()
    hideCreateLanguageModal()
  }

  const handleSubmitEditLanguageFormModal = async (
    values: LocationGroupLanguageFormModalShape,
    language: LocationGroupLanguageModel
  ) => {
    const payload = FormUtil.parseValues<PayloadLocationGroupLanguageUpdate>(values)
    await AdminLocationGroupLanguagesAPI.update(language.id, payload).then((r) => r.data)

    toast.success(intl.formatMessage({ id: 'location_group.message.update_language_success' }))
    refetch()
    hideEditLanguageModal()
  }

  const deleteLanguage = React.useCallback(
    async (language: LocationGroupLanguageModel, index: number) => {
      try {
        const { isConfirmed } = await alert.question({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: language.language?.name }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })

        if (isConfirmed) {
          await AdminLocationGroupLanguagesAPI.delete(language.id)

          refetch()

          // realign active language index
          if (index <= activeLanguageIndex) {
            setActiveLanguageIndex((prev) => (prev > 0 ? prev - 1 : prev))
          }

          toast.success(intl.formatMessage({ id: 'location_group.message.delete_language_success' }))
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
    if (data && data.languages) {
      return data.languages
        .filter((language) => TypeUtil.isDefined(language.language))
        .map<LanguageTab>((language, i) => ({
          id: language.language!.id,
          code: language.language!.code,
          name: language.language!.name,
          toolbar: language.language!.code !== DEFAULT_LANGUAGE && (
            <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_LANGUAGE_DELETE}>
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
    const activeLanguage = data.languages?.at(activeLanguageIndex)
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
                      <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_LANGUAGE_CREATE}>
                        <Button
                          theme="primary"
                          onClick={showCreateLanguageModal}
                          disabled={!canAddLanguage}
                        >
                          <i className="fa-solid fa-plus" />
                          <FormattedMessage id="location_group.button.add_language" />
                        </Button>
                      </PermissionsControl>
                    )}
                  </div>
                </div>

                {activeLanguage && (
                  <React.Fragment>
                    <LocationGroupLanguageDetailCard
                      name={activeLanguage.name}
                      imageAlt={activeLanguage.image_alt}
                      updatedAt={activeLanguage.updated_at}
                      cardTitle={<FormattedMessage id="location_group.section.card_detail_title" />}
                      cardToolbar={
                        <Stack
                          direction="horizontal"
                          gap={3}
                        >
                          <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_LANGUAGE_UPDATE}>
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
              <EmptyContentCard title={<FormattedMessage id="location_group.message.empty_language_placeholder" />}>
                <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_LANGUAGE_CREATE}>
                  <Button
                    theme="primary"
                    onClick={showCreateLanguageModal}
                    disabled={!canAddLanguage}
                  >
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="location_group.button.add_language" />
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
            <LocationGroupImageCard
              cardTitle={<FormattedMessage id="location_group.section.card_image_title" />}
              imageSrc={data.image_file ? data.image_file.link : null}
              toolbar={
                <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_UPDATE}>
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

        <LocationGroupUpdateFormModal
          modalTitle={<FormattedMessage id="location_group.modal.modal_edit_title" />}
          isShow={isShowEditModal}
          initialImageSrc={data.image_file?.link}
          onCancel={hideEditModal}
          onSubmit={handleSubmitEditFormModal}
        />

        <LocationGroupLanguageFormModal
          modalTitle={<FormattedMessage id="location_group.modal.modal_create_language_title" />}
          isShow={isShowCreateLanguageModal}
          locationGroupId={data.id}
          onHide={hideCreateLanguageModal}
          onCancel={hideCreateLanguageModal}
          onSubmit={handleSubmitCreateLanguageFormModal}
        />

        {activeLanguage && (
          <LocationGroupLanguageFormModal
            modalTitle={<FormattedMessage id="location_group.modal.modal_edit_language_title" />}
            isShow={isShowEditLanguageModal}
            locationGroupId={data.id}
            disabledFields={{
              language_id: true,
            }}
            initialValues={{
              name: activeLanguage.name,
              image_alt: activeLanguage.image_alt,
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

export default LocationGroupDetailPage
