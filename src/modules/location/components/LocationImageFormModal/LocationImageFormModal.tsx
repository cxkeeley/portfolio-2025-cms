import { Form, Formik, FormikHelpers } from 'formik'
import React, { FC, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import AdminLocationImagesAPI from '@api/admin/locationImagesAPI'

import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import { TextInputField } from '@components/Form/TextInput'
import FormControl from '@components/FormControl/FormControl'

import { LOCATION_IMAGE_ASPECT_RATIO, LOCATION_IMAGE_MIN_WIDTH } from '@modules/location/constants'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormDisabledFlags, FormHiddenFlags, FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type LocationImageFormModalShape = FormShape<{
  default_image_alt: string
  default_image_caption: string
  image_file_path: string
}>

type Props = {
  isShow: boolean
  modalTitle: React.ReactNode
  initialImageSrc?: string
  initialValues?: Partial<LocationImageFormModalShape>
  disabledFields?: Partial<FormDisabledFlags<LocationImageFormModalShape>>
  hiddenFields?: Partial<FormHiddenFlags<LocationImageFormModalShape>>
  onSubmit: (values: LocationImageFormModalShape) => Promise<void>
  onCancel: () => void
  onHide: () => void
}

const defaultValues: LocationImageFormModalShape = {
  default_image_alt: '',
  default_image_caption: '',
}

const LocationImageFormModal: FC<Props> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const onHide = () => {
    setError(undefined)
    props.onHide()
  }

  const handleSubmit = async (
    values: LocationImageFormModalShape,
    helpers: FormikHelpers<LocationImageFormModalShape>
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

      <Formik<LocationImageFormModalShape>
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
                {!props.hiddenFields?.image_file_path && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="vocabulary.image" />
                      </FormControl.Label>
                      <ImageUploadField
                        name="image_file_path"
                        accept={['.png', '.jpg', '.jpeg']}
                        initialImageSrc={props.initialImageSrc}
                        cropperModalTitle={<FormattedMessage id="location_iamge.section.modal_cropper_image_title" />}
                        uploadFn={AdminLocationImagesAPI.uploadImage}
                        accessor={(response) => response.data.data.path}
                        maxFileSize={1 * 1024 * 1024}
                        cropWidth={LOCATION_IMAGE_MIN_WIDTH}
                        cropHeight={Math.round(LOCATION_IMAGE_MIN_WIDTH / LOCATION_IMAGE_ASPECT_RATIO)}
                        minResolutionWidth={LOCATION_IMAGE_MIN_WIDTH}
                        minResolutionHeight={Math.round(LOCATION_IMAGE_MIN_WIDTH / LOCATION_IMAGE_ASPECT_RATIO)}
                        aspectRatio={LOCATION_IMAGE_ASPECT_RATIO}
                      />
                      <FormControl.ErrorMessage message={formik.errors.image_file_path} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.default_image_alt && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="location_image.label.default_image_alt" />
                      </FormControl.Label>
                      <TextInputField
                        name="default_image_alt"
                        isDisabled={props.disabledFields?.default_image_alt}
                      />
                      <FormControl.ErrorMessage message={formik.errors.default_image_alt} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.default_image_caption && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="location_image.label.default_image_caption" />
                      </FormControl.Label>
                      <TextInputField
                        name="default_image_caption"
                        isDisabled={props.disabledFields?.default_image_caption}
                      />
                      <FormControl.ErrorMessage message={formik.errors.default_image_caption} />
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

export type { LocationImageFormModalShape }

export default LocationImageFormModal
