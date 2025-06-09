import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import AdminLocationImageLanguagesAPI, {
  PayloadAdminLocationImageLanguageCreate,
  PayloadAdminLocationImageLanguageUpdate,
} from '@api/admin/locationImageLanguagesAPI'
import AdminLocationImagesAPI from '@api/admin/locationImagesAPI'

import { LanguageCodeEnum } from '@models/language'
import { LocationImageLanguageModel } from '@models/locationImageLanguage'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import LanguageTabDeleteButton from '@components/LanguageTabDeleteButton'
import LanguageTabSwitcher, { LanguageTab } from '@components/LanguageTabSwitcher'

import LocationImageDetailCard from '@modules/location/components/LocationImageDetailCard'
import LocationImageFormModal, {
  LocationImageFormModalShape,
} from '@modules/location/components/LocationImageFormModal'
import LocationImageLanguageDetailCard from '@modules/location/components/LocationImageLanguageDetailCard'
import LocationImageLanguageFormModal, {
  LocationImageLanguageFormModalShape,
} from '@modules/location/components/LocationImageLanguageFormModal'
import { PermissionsControl } from '@modules/permissions'

import { DEFAULT_LANGUAGE } from '@/constants/constant'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

const LocationImageDetailPage: React.FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { locationId, locationImageId } = useParams()
  const [isShowEditModal, , showEditModal, hideEditModal] = useBoolState()
  const [isShowCreateLanguageModal, , showCreateLanguageModal, hideCreateLanguageModal] = useBoolState()
  const [isShowEditLanguageModal, , showEditLanguageModal, hideEditLanguageModal] = useBoolState()
  const [activeLanguageIndex, setActiveLanguageIndex] = React.useState(0)

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [QUERIES.ADMIN_LOCATION_IMAGE_DETAIL, { locationId, locationImageId }],
    queryFn: () => AdminLocationImagesAPI.get(locationImageId!),
    select: (response) => response.data.data.location_image,
  })

  const handleLanguageTabChange = (_: unknown, index: number) => {
    setActiveLanguageIndex(index)
  }

  const handleSubmitEditFormModal = async (values: LocationImageFormModalShape) => {
    await AdminLocationImagesAPI.updateImage(locationImageId!, {
      image_file_path: values.image_file_path ?? '',
    })

    // update featured image on location detail
    queryClient.invalidateQueries([QUERIES.ADMIN_LOCATION_DETAIL, { locationId }])

    refetch()
    hideEditModal()
  }

  const handleSubmitCreateLanguageFormModal = async (values: LocationImageLanguageFormModalShape) => {
    const payload = FormUtil.parseValues<PayloadAdminLocationImageLanguageCreate>(values)
    await AdminLocationImageLanguagesAPI.create({
      ...payload,
      location_image_id: locationImageId!,
    })

    refetch()
    hideCreateLanguageModal()

    toast.success(intl.formatMessage({ id: 'location_group.message.create_language_success' }))
  }

  const handleSubmitEditLanguageFormModal = async (
    values: LocationImageLanguageFormModalShape,
    language: LocationImageLanguageModel
  ) => {
    const payload = FormUtil.parseValues<PayloadAdminLocationImageLanguageUpdate>(values)
    await AdminLocationImageLanguagesAPI.update(language.id, payload)

    refetch()
    hideEditLanguageModal()

    toast.success(intl.formatMessage({ id: 'location_group.message.update_language_success' }))
  }

  const deleteLanguage = React.useCallback(
    async (language: LocationImageLanguageModel, index: number) => {
      try {
        const { isConfirmed } = await alert.question({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: language.language?.name }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })

        if (isConfirmed) {
          await AdminLocationImageLanguagesAPI.delete(language.id)
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
                    <LocationImageLanguageDetailCard
                      imageCaption={activeLanguage.image_caption}
                      imageAlt={activeLanguage.image_alt}
                      updatedAt={activeLanguage.updated_at}
                      cardTitle={<FormattedMessage id="location_image.section.card_detail_title" />}
                      cardToolbar={
                        <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_IMAGE_LANGUAGE_UPDATE}>
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
            <LocationImageDetailCard
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

        <LocationImageFormModal
          modalTitle={<FormattedMessage id="location_image.section.modal_edit_title" />}
          isShow={isShowEditModal}
          initialImageSrc={data.image_file?.link}
          hiddenFields={{
            default_image_alt: true,
            default_image_caption: true,
          }}
          onHide={hideEditModal}
          onCancel={hideEditModal}
          onSubmit={handleSubmitEditFormModal}
        />

        <LocationImageLanguageFormModal
          locationImageId={data.id}
          modalTitle={<FormattedMessage id="location_image.section.modal_create_language_title" />}
          isShow={isShowCreateLanguageModal}
          onHide={hideCreateLanguageModal}
          onCancel={hideCreateLanguageModal}
          onSubmit={handleSubmitCreateLanguageFormModal}
        />

        {activeLanguage && (
          <LocationImageLanguageFormModal
            modalTitle={<FormattedMessage id="location_image.section.modal_edit_language_title" />}
            isShow={isShowEditLanguageModal}
            locationImageId={data.id}
            disabledFields={{
              language_id: true,
            }}
            initialValues={{
              image_alt: activeLanguage.image_alt,
              image_caption: activeLanguage.image_caption,
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

export default LocationImageDetailPage
