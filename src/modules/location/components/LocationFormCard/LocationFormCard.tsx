import { Form, Formik, FormikHelpers } from 'formik'
import { FC, useState } from 'react'
import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'

import { Option } from '@models/option'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { PhoneInputField } from '@components/Form/PhoneInput'
import { RadioButtonGroupField } from '@components/Form/RadioButtonGroup'
import { TextInputField } from '@components/Form/TextInput'
import { TextareaField } from '@components/Form/Textarea'
import { FormControl } from '@components/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'
import Map from '@components/Map'
import MapPinpoint from '@components/MapPinpoint'
import PinpointMapModal from '@components/PinpointMapModal'

import LocationLabelForLocationFormSelectField from '@modules/location-label/components/LocationLabelForLocationFormSelectField'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { useAlert, useBoolState } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormHiddenFlags, FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

import { LocationLocationGroupSelectField } from '../LocationLocationGroupSelectField'

type LocationFormCardShape = FormShape<{
  default_address: string
  default_description: string
  default_name: string
  default_short_name: string
  is_coming_soon: boolean
  latitude: number
  location_group_id: Option
  location_label_id: Option
  longitude: number
  phone_number: string
}>

type LocationFormCardProps = {
  initialValues?: Partial<LocationFormCardShape>
  hiddenFields?: Partial<FormHiddenFlags<LocationFormCardShape>>
  onSubmit: (values: LocationFormCardShape) => Promise<void>
  onCancel: () => void
}

const LocationFormCard: FC<LocationFormCardProps> = (props) => {
  const intl = useIntl()
  const alert = useAlert()
  const [error, setError] = useState<string>()
  const [isShowPinpointLocationModal, , showPinpointLocationModal, hidePinpointLocationModal] = useBoolState(false)

  const defaultValues: LocationFormCardShape = {
    is_coming_soon: false,
  }

  const handleSubmit = async (values: LocationFormCardShape, helpers: FormikHelpers<LocationFormCardShape>) => {
    try {
      helpers.setSubmitting(true)

      await props.onSubmit(values)
    } catch (err) {
      if (AxiosUtil.isAxiosError(err)) {
        const errors = FormUtil.parseErrorResponse(err.response?.data.errors)
        if (errors) {
          helpers.setErrors(errors)
        } else {
          setError(err.response?.data.message)
        }
      } else {
        alert.error({ text: String(err) })
      }
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <Formik<LocationFormCardShape>
      initialValues={props.initialValues ?? defaultValues}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form
          noValidate={true}
          onSubmit={formik.handleSubmit}
        >
          <KTCard>
            <KTCard.Body>
              <AlertErrorForm
                show={!!error}
                message={error!}
                className="mb-10"
              />

              <FormSection
                title={<FormattedMessage id="form.section_general_title" />}
                description={
                  <FormattedMessage
                    id="form.section_general_description"
                    values={{
                      model: <FormattedMessage id="model.location" />,
                    }}
                  />
                }
              >
                <Row>
                  {!props.hiddenFields?.default_short_name && (
                    <Col
                      xs={12}
                      xl={5}
                      xxl={4}
                      className="mb-7"
                    >
                      <FormControl>
                        <FormControl.Label isRequired>
                          <FormattedMessage id="location.label.default_short_name" />
                        </FormControl.Label>
                        <TextInputField name="default_short_name" />
                        <FormControl.ErrorMessage message={formik.errors.default_short_name} />
                      </FormControl>
                    </Col>
                  )}

                  {!props.hiddenFields?.default_name && (
                    <Col
                      xs={12}
                      xl={7}
                      xxl={8}
                      className="mb-7"
                    >
                      <FormControl>
                        <FormControl.Label isRequired>
                          <FormattedMessage id="location.label.default_name" />
                        </FormControl.Label>
                        <TextInputField name="default_name" />
                        <FormControl.ErrorMessage message={formik.errors.default_name} />
                      </FormControl>
                    </Col>
                  )}

                  {!props.hiddenFields?.default_description && (
                    <Col
                      xs={12}
                      className="mb-7"
                    >
                      <FormControl>
                        <FormControl.Label isRequired>
                          <FormattedMessage id="location.label.default_description" />
                        </FormControl.Label>
                        <TextareaField
                          name="default_description"
                          rows={3}
                        />
                        <FormControl.ErrorMessage message={formik.errors.default_description} />
                      </FormControl>
                    </Col>
                  )}

                  {!props.hiddenFields?.location_group_id && (
                    <Col
                      xs={12}
                      md={6}
                      className="mb-7"
                    >
                      <FormControl>
                        <FormControl.Label isRequired>
                          <FormattedMessage id="location.label.group" />
                        </FormControl.Label>
                        <PermissionsControl
                          renderError={true}
                          allow={[PermissionEnum.ADMIN_LOCATION_GROUP_OPTION_FOR_LOCATION_FORM]}
                        >
                          <LocationLocationGroupSelectField name="location_group_id" />
                        </PermissionsControl>
                        <FormControl.ErrorMessage message={formik.errors.location_group_id} />
                      </FormControl>
                    </Col>
                  )}

                  {!props.hiddenFields?.location_label_id && (
                    <Col
                      xs={12}
                      md={6}
                      className="mb-7"
                    >
                      <FormControl>
                        <FormControl.Label>
                          <FormattedMessage id="location.label.label" />
                        </FormControl.Label>
                        <PermissionsControl
                          renderError={true}
                          allow={[PermissionEnum.ADMIN_LOCATION_LABEL_OPTION_FOR_LOCATION_FORM]}
                        >
                          <LocationLabelForLocationFormSelectField
                            isClearable={true}
                            name="location_label_id"
                          />
                        </PermissionsControl>
                        <FormControl.ErrorMessage message={formik.errors.location_label_id} />
                      </FormControl>
                    </Col>
                  )}

                  {!props.hiddenFields?.phone_number && (
                    <Col
                      xs={12}
                      md={6}
                      className="mb-7"
                    >
                      <FormControl>
                        <FormControl.Label isRequired>
                          <FormattedMessage id="location.label.phone_number" />
                        </FormControl.Label>
                        <PhoneInputField name="phone_number" />
                        <FormControl.ErrorMessage message={formik.errors.phone_number} />
                      </FormControl>
                    </Col>
                  )}

                  {!props.hiddenFields?.is_coming_soon && (
                    <Col xs={12}>
                      <FormControl>
                        <FormControl.Label>
                          <FormattedMessage id="location.label.status" />
                        </FormControl.Label>

                        <RadioButtonGroupField
                          direction="horizontal"
                          name="is_coming_soon"
                          options={[
                            {
                              value: false,
                              label: intl.formatMessage({ id: 'form.radio.active' }),
                            },
                            {
                              value: true,
                              label: intl.formatMessage({ id: 'location.form.radio.coming_soon' }),
                            },
                          ]}
                        />
                        <FormControl.ErrorMessage message={formik.errors.is_coming_soon} />
                      </FormControl>
                    </Col>
                  )}
                </Row>
              </FormSection>

              <FormSection
                title={<FormattedMessage id="location.section.form_address_title" />}
                description={<FormattedMessage id="location.section.form_address_description" />}
                isEndOfChild
              >
                <Row>
                  {!props.hiddenFields?.default_address && (
                    <Col
                      xs={12}
                      className="mb-7"
                    >
                      <FormControl>
                        <FormControl.Label isRequired>
                          <FormattedMessage id="location.label.default_address" />
                        </FormControl.Label>
                        <TextareaField
                          name="default_address"
                          rows={3}
                        />
                        <FormControl.ErrorMessage message={formik.errors.default_address} />
                      </FormControl>
                    </Col>
                  )}

                  {(!props.hiddenFields?.latitude || !props.hiddenFields.longitude) && (
                    <React.Fragment>
                      {!props.hiddenFields?.latitude && (
                        <Col lg={6}>
                          <FormControl>
                            <FormControl.Label>
                              <FormattedMessage id="location.label.latitude" />
                            </FormControl.Label>
                            <TextInputField name="latitude" />
                            <FormControl.ErrorMessage message={formik.errors.latitude} />
                          </FormControl>
                        </Col>
                      )}

                      {!props.hiddenFields?.longitude && (
                        <Col lg={6}>
                          <FormControl>
                            <FormControl.Label>
                              <FormattedMessage id="location.label.longitude" />
                            </FormControl.Label>
                            <TextInputField name="longitude" />
                            <FormControl.ErrorMessage message={formik.errors.longitude} />
                          </FormControl>
                        </Col>
                      )}

                      <Col
                        xs={12}
                        className="mt-7"
                      >
                        <FormControl>
                          <Map
                            width="100%"
                            height="220px"
                            className="rounded border"
                            latitude={formik.values?.latitude ?? undefined}
                            longitude={formik.values?.longitude ?? undefined}
                            options={{
                              zoomControl: false,
                              dragging: false,
                              scrollWheelZoom: false,
                            }}
                          >
                            {TypeUtil.isDefined(formik.values.latitude) &&
                              TypeUtil.isDefined(formik.values.longitude) && <MapPinpoint />}

                            <div className="position-absolute z-index-2 right-0 top-0 p-5">
                              <Button
                                theme="light"
                                textColor="dark"
                                size="sm"
                                className="shadow"
                                onClick={showPinpointLocationModal}
                              >
                                <FormattedMessage id="location.button.select_location_from_map" />
                              </Button>
                            </div>
                          </Map>

                          <PinpointMapModal
                            isShow={isShowPinpointLocationModal}
                            modalTitle={<FormattedMessage id="location.modal.pinpoint_location" />}
                            onClose={hidePinpointLocationModal}
                            latitude={formik.values.latitude ?? undefined}
                            longitude={formik.values.longitude ?? undefined}
                            onSelected={(latitude, longitude) => {
                              formik.setFieldValue('latitude', latitude)
                              formik.setFieldValue('longitude', longitude)
                              hidePinpointLocationModal()
                            }}
                          />
                        </FormControl>
                      </Col>
                    </React.Fragment>
                  )}
                </Row>
              </FormSection>
            </KTCard.Body>

            <KTCard.Footer className="d-flex justify-content-end gap-3">
              <Button
                theme="secondary"
                disabled={formik.isSubmitting}
                onClick={props.onCancel}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                type="submit"
                theme="primary"
                disabled={!formik.dirty}
                isLoading={formik.isSubmitting}
              >
                <FormattedMessage id="form.submit" />
              </Button>
            </KTCard.Footer>
          </KTCard>
        </Form>
      )}
    </Formik>
  )
}

export type { LocationFormCardProps, LocationFormCardShape }

export default LocationFormCard
