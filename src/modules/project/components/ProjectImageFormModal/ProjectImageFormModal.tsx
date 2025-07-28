import { Form, Formik, FormikHelpers } from 'formik'
import React, { FC, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import AdminProjectImagesAPI from '@api/admin/projectImagesAPI'

import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import { TextInputField } from '@components/Form/TextInput'
import FormControl from '@components/FormControl/FormControl'

import { PROJECT_IMAGE_ASPECT_RATIO, PROJECT_IMAGE_MIN_WIDTH } from '@modules/project/constants'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormDisabledFlags, FormHiddenFlags, FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type ProjectImageFormModalShape = FormShape<{
  default_image_alt: string
  default_image_caption: string
  image_file_path: string
}>

type Props = {
  isShow: boolean
  modalTitle: React.ReactNode
  initialImageSrc?: string
  initialValues?: Partial<ProjectImageFormModalShape>
  disabledFields?: Partial<FormDisabledFlags<ProjectImageFormModalShape>>
  hiddenFields?: Partial<FormHiddenFlags<ProjectImageFormModalShape>>
  onSubmit: (values: ProjectImageFormModalShape) => Promise<void>
  onCancel: () => void
  onHide: () => void
}

const defaultValues: ProjectImageFormModalShape = {
  default_image_alt: '',
  default_image_caption: '',
}

const ProjectImageFormModal: FC<Props> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const onHide = () => {
    setError(undefined)
    props.onHide()
  }

  const handleSubmit = async (
    values: ProjectImageFormModalShape,
    helpers: FormikHelpers<ProjectImageFormModalShape>
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

      <Formik<ProjectImageFormModalShape>
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
                        cropperModalTitle={<FormattedMessage id="project_iamge.section.modal_cropper_image_title" />}
                        uploadFn={AdminProjectImagesAPI.uploadImage}
                        accessor={(response) => response.data.data.path}
                        maxFileSize={1 * 1024 * 1024}
                        cropWidth={PROJECT_IMAGE_MIN_WIDTH}
                        cropHeight={Math.round(PROJECT_IMAGE_MIN_WIDTH / PROJECT_IMAGE_ASPECT_RATIO)}
                        minResolutionWidth={PROJECT_IMAGE_MIN_WIDTH}
                        minResolutionHeight={Math.round(PROJECT_IMAGE_MIN_WIDTH / PROJECT_IMAGE_ASPECT_RATIO)}
                        aspectRatio={PROJECT_IMAGE_ASPECT_RATIO}
                      />
                      <FormControl.ErrorMessage message={formik.errors.image_file_path} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.default_image_alt && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="project_image.label.default_image_alt" />
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
                        <FormattedMessage id="project_image.label.default_image_caption" />
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

export type { ProjectImageFormModalShape }

export default ProjectImageFormModal
