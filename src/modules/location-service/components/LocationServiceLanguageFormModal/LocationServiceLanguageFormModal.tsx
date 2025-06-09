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

import LanguageForLocationServiceLanguageSelectField from '@modules/language/components/LanguageForLocationServiceLanguageSelectField'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormDisabledFlags, FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type LocationServiceLanguageFormModalShape = FormShape<{
  image_alt: string
  language_id: Option
  short_description: string
  title: string
}>

type Props = {
  isShow: boolean
  modalTitle: React.ReactNode
  locationServiceId: ID
  initialValues?: Partial<LocationServiceLanguageFormModalShape>
  disabledFields?: Partial<FormDisabledFlags<LocationServiceLanguageFormModalShape>>
  onSubmit: (values: LocationServiceLanguageFormModalShape) => Promise<void>
  onCancel: () => void
  onHide: () => void
}

const defaultValues: LocationServiceLanguageFormModalShape = {}

const LocationServiceLanguageFormModal: FC<Props> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const onHide = () => {
    setError(undefined)
    props.onHide()
  }

  const handleSubmit = async (
    values: LocationServiceLanguageFormModalShape,
    helpers: FormikHelpers<LocationServiceLanguageFormModalShape>
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

      <Formik<LocationServiceLanguageFormModalShape>
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
                <Col xs={12}>
                  <FormControl>
                    <FormControl.Label isRequired>
                      <FormattedMessage id="vocabulary.language" />
                    </FormControl.Label>
                    <PermissionsControl
                      renderError={true}
                      allow={[PermissionEnum.ADMIN_LANGUAGE_OPTION_FOR_LOCATION_LANGUAGE_FORM]}
                    >
                      <LanguageForLocationServiceLanguageSelectField
                        name="language_id"
                        locationServiceId={props.locationServiceId}
                        isDisabled={props.disabledFields?.language_id}
                      />
                    </PermissionsControl>
                    <FormControl.ErrorMessage message={formik.errors.language_id} />
                  </FormControl>
                </Col>

                <Col xs={12}>
                  <FormControl>
                    <FormControl.Label isRequired>
                      <FormattedMessage id="vocabulary.title" />
                    </FormControl.Label>
                    <TextInputField
                      name="title"
                      isDisabled={props.disabledFields?.title}
                    />
                    <FormControl.ErrorMessage message={formik.errors.title} />
                  </FormControl>
                </Col>

                <Col xs={12}>
                  <FormControl>
                    <FormControl.Label isRequired>
                      <FormattedMessage id="location_service.label.short_description" />
                    </FormControl.Label>
                    <TextareaField
                      name="short_description"
                      rows={5}
                      disabled={props.disabledFields?.short_description}
                    />
                    <FormControl.ErrorMessage message={formik.errors.short_description} />
                  </FormControl>
                </Col>

                <Col xs={12}>
                  <FormControl>
                    <FormControl.Label>
                      <FormattedMessage id="location_service.label.image_alt" />
                    </FormControl.Label>
                    <TextInputField
                      name="image_alt"
                      isDisabled={props.disabledFields?.title}
                    />
                    <FormControl.ErrorMessage message={formik.errors.image_alt} />
                  </FormControl>
                </Col>
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

export type { LocationServiceLanguageFormModalShape }

export default LocationServiceLanguageFormModal
