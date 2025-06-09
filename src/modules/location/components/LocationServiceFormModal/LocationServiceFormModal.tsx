import { Form, Formik, FormikHelpers } from 'formik'
import React, { FC, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import { Option } from '@models/option'

import { Button } from '@components/Button'
import FormControl from '@components/FormControl/FormControl'

import LocationServiceForLocationFormSelectField from '@modules/location-service/components/LocationServiceForLocationFormSelectField'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormDisabledFlags, FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'
import { ID } from '@models/base'

type LocationServiceFormModalShape = FormShape<{
  location_service_id: Option
}>

type Props = {
  isShow: boolean
  modalTitle: React.ReactNode
  locationId: ID
  initialImageSrc?: string
  initialValues?: Partial<LocationServiceFormModalShape>
  disabledFields?: Partial<FormDisabledFlags<LocationServiceFormModalShape>>
  onSubmit: (values: LocationServiceFormModalShape) => Promise<void>
  onCancel: () => void
  onHide: () => void
}

const defaultValues: LocationServiceFormModalShape = {}

const LocationServiceFormModal: FC<Props> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const onHide = () => {
    setError(undefined)
    props.onHide()
  }

  const handleSubmit = async (
    values: LocationServiceFormModalShape,
    helpers: FormikHelpers<LocationServiceFormModalShape>
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

      <Formik<LocationServiceFormModalShape>
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
                      <FormattedMessage id="location.label.service" />
                    </FormControl.Label>
                    <PermissionsControl
                      renderError={true}
                      allow={[PermissionEnum.ADMIN_LOCATION_SERVICE_OPTION_FOR_LOCATION_FORM]}
                    >
                      <LocationServiceForLocationFormSelectField
                        name="location_service_id"
                        locationId={props.locationId}
                        isDisabled={props.disabledFields?.location_service_id}
                      />
                    </PermissionsControl>
                    <FormControl.ErrorMessage message={formik.errors.location_service_id} />
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

export type { LocationServiceFormModalShape }

export default LocationServiceFormModal
