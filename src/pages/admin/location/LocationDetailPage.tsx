import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'

import AdminLocationLanguagesAPI, {
  PayloadAdminLocationLanguageCreate,
  PayloadAdminLocationLanguageUpdate,
} from '@api/admin/locationLanguagesAPI'
import AdminLocationsAPI from '@api/admin/locationsAPI'

import { LanguageCodeEnum } from '@models/language'
import { LocationLanguageModel } from '@models/locationLanguage'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import LanguageTabDeleteButton from '@components/LanguageTabDeleteButton'
import LanguageTabSwitcher, { LanguageTab } from '@components/LanguageTabSwitcher'

import LocationContentCard from '@modules/location/components/LocationContentCard'
import { LocationDetailCard } from '@modules/location/components/LocationDetailCard'
import LocationFeaturedImageCard from '@modules/location/components/LocationFeaturedImageCard/LocationFeaturedImageCard'
import LocationLanguageDetailCard from '@modules/location/components/LocationLanguageDetailCard/LocationLanguageDetailCard'
import LocationLanguageFormModal, {
  LocationLanguageFormModalShape,
} from '@modules/location/components/LocationLanguageFormModal'
import { PermissionsControl } from '@modules/permissions'

import { DEFAULT_LANGUAGE } from '@/constants/constant'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

const LocationDetailPage: React.FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const alert = useAlert()
  const { locationId } = useParams()
  const [activeLanguageIndex, setActiveLanguageIndex] = React.useState(0)
  const [isShowCreateLanguageModal, , showCreateLanguageModal, hideCreateLanguageModal] = useBoolState(false)
  const [isShowEditLanguageModal, , showEditLanguageModal, hideEditLanguageModal] = useBoolState(false)

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    enabled: TypeUtil.isDefined(locationId),
    queryKey: [QUERIES.ADMIN_LOCATION_DETAIL, { locationId }],
    queryFn: () => AdminLocationsAPI.get(locationId!),
    select: (r) => r.data.data?.location,
  })

  const handleSubmitCreateLanguage = async (values: LocationLanguageFormModalShape) => {
    const payload = FormUtil.parseValues<PayloadAdminLocationLanguageCreate>(values)
    await AdminLocationLanguagesAPI.create({
      ...payload,
      location_id: locationId!,
    })

    toast.success(intl.formatMessage({ id: 'location.message.create_language_success' }))
    refetch()
    hideCreateLanguageModal()
  }

  const handleSubmitEditLanguage = async (values: LocationLanguageFormModalShape, language: LocationLanguageModel) => {
    const payload = FormUtil.parseValues<PayloadAdminLocationLanguageUpdate>(values)
    await AdminLocationLanguagesAPI.update(language.id, payload)

    toast.success(intl.formatMessage({ id: 'location.message.update_language_success' }))
    refetch()
    hideEditLanguageModal()
  }

  const deleteLanguage = React.useCallback(
    async (language: LocationLanguageModel, index: number) => {
      try {
        const { isConfirmed } = await alert.question({
          text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: language.language?.name }),
          confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
        })
        if (!isConfirmed) return

        await AdminLocationLanguagesAPI.delete(language.id)
        refetch()
        // realign active language index
        if (index <= activeLanguageIndex) {
          setActiveLanguageIndex((prev) => (prev > 0 ? prev - 1 : prev))
        }
        toast.success(intl.formatMessage({ id: 'location.message.delete_language_success' }))
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
            <LocationDetailCard
              cardTitle={<FormattedMessage id="location.section.card_general_title" />}
              address={data.address}
              phoneNumber={data.phone_number}
              locationGroupName={data.location_group ? data.location_group.name : ''}
              locationLabel={data.location_label ? data.location_label.default_name : ''}
              isComingSoon={data.is_coming_soon}
              latitude={data.latitude}
              longitude={data.longitude}
              updatedAt={data.updated_at}
              cardToolbar={
                <PermissionsControl allow={[PermissionEnum.ADMIN_LOCATION_UPDATE]}>
                  <Link
                    to={`/admin/locations/edit/${locationId}`}
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
                      <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_LANGUAGE_CREATE}>
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
                    <LocationLanguageDetailCard
                      name={activeLanguage.name}
                      address={activeLanguage.address}
                      description={activeLanguage.description}
                      shortName={activeLanguage.short_name}
                      slug={activeLanguage.slug}
                      updatedAt={activeLanguage.updated_at}
                      cardTitle={<FormattedMessage id="location_group.section.card_detail_title" />}
                      cardToolbar={
                        <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_LANGUAGE_UPDATE}>
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
              <EmptyContentCard title={<FormattedMessage id="location.message.empty_language_placeholder" />}>
                <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_LANGUAGE_CREATE}>
                  <Button
                    theme="primary"
                    onClick={showCreateLanguageModal}
                    disabled={!canAddLanguage}
                  >
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="location.button.add_language" />
                  </Button>
                </PermissionsControl>
              </EmptyContentCard>
            )}

            <LocationContentCard locationId={data.id} />
          </Col>

          <Col
            xs={12}
            xl={4}
          >
            <LocationFeaturedImageCard
              cardTitle={<FormattedMessage id="location.section.card_image_title" />}
              imageSrc={data.image_file ? data.image_file.link : null}
            />
          </Col>
        </Row>

        <LocationLanguageFormModal
          isShow={isShowCreateLanguageModal}
          modalTitle={<FormattedMessage id="location.modal.add_language_title" />}
          hiddenFields={{
            slug: true,
          }}
          locationId={data.id}
          onHide={hideCreateLanguageModal}
          onCancel={hideCreateLanguageModal}
          onSubmit={handleSubmitCreateLanguage}
        />

        {activeLanguage && (
          <LocationLanguageFormModal
            isShow={isShowEditLanguageModal}
            modalTitle={<FormattedMessage id="location.modal.edit_language_title" />}
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
            locationId={data.id}
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

export default LocationDetailPage
