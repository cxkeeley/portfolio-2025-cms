import { Form, Formik, FormikHelpers } from 'formik'
import React, { FC, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import { ID } from '@models/base'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import { TextInputField } from '@components/Form/TextInput'
import { TextareaField } from '@components/Form/Textarea'
import FormControl from '@components/FormControl/FormControl'

import LanguageForLocationLanguageFormSelectField from '@modules/language/components/LanguageForLocationLanguageFormSelectField'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormDisabledFlags, FormHiddenFlags, FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type LocationLanguageFormModalShape = FormShape<{
  address: string
  description: string
  language_id: Option
  name: string
  short_name: string
  slug: string
}>

type Props = {
  isShow: boolean
  modalTitle: React.ReactNode
  locationId: ID
  initialValues?: Partial<LocationLanguageFormModalShape>
  disabledFields?: Partial<FormDisabledFlags<LocationLanguageFormModalShape>>
  hiddenFields?: Partial<FormHiddenFlags<LocationLanguageFormModalShape>>
  onSubmit: (values: LocationLanguageFormModalShape) => Promise<void>
  onCancel: () => void
  onHide: () => void
}

const defaultValues: LocationLanguageFormModalShape = {}

const LocationLanguageFormModal: FC<Props> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const onHide = () => {
    setError(undefined)
    props.onHide()
  }

  const handleSubmit = async (
    values: LocationLanguageFormModalShape,
    helpers: FormikHelpers<LocationLanguageFormModalShape>
  ) => {
    try {
      helpers.setSubmitting(true)
      await props.onSubmit(values)
    } catch (err) {
      if (AxiosUtil.isAxiosError(err)) {
        const errors = FormUtil.parseErrorResponse(err.response?.data.errors)
        if (errors) {
          helpers.setErrors(errors)
        } else {
          setError(err.response?.data.message || err.message)
        }
      } else {
        alert.error({ text: String(err) })
      }
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <Modal
      size="lg"
      centered={true}
      show={props.isShow}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h3">{props.modalTitle}</Modal.Title>
      </Modal.Header>

      <Formik<LocationLanguageFormModalShape>
        initialValues={props.initialValues ?? defaultValues}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <Modal.Body className="scroll-y mx-5 mx-xl-15 my-7">
              <Alert
                show={TypeUtil.isDefined(error)}
                variant="danger"
                className="p-5 mb-10"
              >
                {error}
              </Alert>

              <Row className="gap-7">
                {!props.hiddenFields?.language_id && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="vocabulary.language" />
                      </FormControl.Label>
                      <PermissionsControl
                        renderError={true}
                        allow={[PermissionEnum.ADMIN_LANGUAGE_OPTION_FOR_LOCATION_LANGUAGE_FORM]}
                      >
                        <LanguageForLocationLanguageFormSelectField
                          name="language_id"
                          locationId={props.locationId}
                          isDisabled={props.disabledFields?.language_id}
                        />
                      </PermissionsControl>
                      <FormControl.ErrorMessage message={formik.errors.language_id} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.slug && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="vocabulary.slug" />
                      </FormControl.Label>
                      <TextInputField
                        name="slug"
                        isDisabled={props.disabledFields?.slug}
                      />
                      <FormControl.ErrorMessage message={formik.errors.slug} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.short_name && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="location.label.short_name" />
                      </FormControl.Label>
                      <TextInputField
                        name="short_name"
                        isDisabled={props.disabledFields?.short_name}
                      />
                      <FormControl.ErrorMessage message={formik.errors.short_name} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.name && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="location.label.name" />
                      </FormControl.Label>
                      <TextInputField
                        name="name"
                        isDisabled={props.disabledFields?.name}
                      />
                      <FormControl.ErrorMessage message={formik.errors.name} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.address && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="location.label.address" />
                      </FormControl.Label>
                      <TextareaField
                        name="address"
                        rows={3}
                        disabled={props.disabledFields?.address}
                      />
                      <FormControl.ErrorMessage message={formik.errors.address} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.description && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="location.label.description" />
                      </FormControl.Label>
                      <TextareaField
                        name="description"
                        rows={5}
                        disabled={props.disabledFields?.description}
                      />
                      <FormControl.ErrorMessage message={formik.errors.description} />
                    </FormControl>
                  </Col>
                )}
              </Row>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                theme="light"
                onClick={props.onCancel}
                disabled={formik.isSubmitting}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                theme="primary"
                type="submit"
                disabled={!formik.dirty}
                isLoading={formik.isSubmitting}
              >
                <FormattedMessage id="form.submit" />
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export type { LocationLanguageFormModalShape }

export default LocationLanguageFormModal
