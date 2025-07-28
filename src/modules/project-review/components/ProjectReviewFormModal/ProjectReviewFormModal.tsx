import { Form, Formik, FormikHelpers } from 'formik'
import React, { FC, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import AdminProjectImagesAPI from '@api/admin/projectImagesAPI'

import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import { TextInputField } from '@components/Form/TextInput'
import { TextareaField } from '@components/Form/Textarea'
import FormControl from '@components/FormControl/FormControl'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormDisabledFlags, FormHiddenFlags, FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type ProjectReviewFormModalShape = FormShape<{
  client_image_alt: string
  client_image_file_path: string
  client_name: string
  project_id: string
  story: string
}>

type Props = {
  isShow: boolean
  modalTitle: React.ReactNode
  initialImageSrc?: string
  initialValues?: Partial<ProjectReviewFormModalShape>
  disabledFields?: Partial<FormDisabledFlags<ProjectReviewFormModalShape>>
  hiddenFields?: Partial<FormHiddenFlags<ProjectReviewFormModalShape>>
  onSubmit: (values: ProjectReviewFormModalShape) => Promise<void>
  onCancel: () => void
  onHide: () => void
}

const defaultValues: ProjectReviewFormModalShape = {
  client_image_alt: null,
  client_image_file_path: '',
  client_name: '',
  story: '',
}

const ProjectReviewFormModal: FC<Props> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const onHide = () => {
    setError(undefined)
    props.onHide()
  }

  const handleSubmit = async (
    values: ProjectReviewFormModalShape,
    helpers: FormikHelpers<ProjectReviewFormModalShape>
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

      <Formik<ProjectReviewFormModalShape>
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
                {!props.hiddenFields?.client_name && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired={true}>
                        <FormattedMessage id="project_review.label.client_name" />
                      </FormControl.Label>
                      <TextInputField
                        name="client_name"
                        isDisabled={props.disabledFields?.client_name}
                      />
                      <FormControl.ErrorMessage message={formik.errors.client_name} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.story && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired={true}>
                        <FormattedMessage id="project_review.label.story" />
                      </FormControl.Label>
                      <TextareaField
                        name="story"
                        rows={5}
                        disabled={props.disabledFields?.story}
                      />
                      <FormControl.ErrorMessage message={formik.errors.story} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.client_image_file_path && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired={true}>
                        <FormattedMessage id="project_review.label.client_image" />
                      </FormControl.Label>
                      <ImageUploadField
                        name="client_image_file_path"
                        accept={['.png', '.jpg', '.jpeg']}
                        initialImageSrc={props.initialImageSrc}
                        cropperModalTitle={<FormattedMessage id="project_review.section.modal_cropper_image_title" />}
                        uploadFn={AdminProjectImagesAPI.uploadImage}
                        accessor={(response) => response.data.data.path}
                        maxFileSize={1 * 1024 * 1024}
                        cropWidth={128}
                        cropHeight={128}
                        minResolutionWidth={128}
                        minResolutionHeight={128}
                        aspectRatio={1 / 1}
                      />
                      <FormControl.ErrorMessage message={formik.errors.client_image_file_path} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.client_image_alt && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="project_review.label.client_image_alt" />
                      </FormControl.Label>
                      <TextInputField
                        name="client_image_alt"
                        isDisabled={props.disabledFields?.client_image_alt}
                      />
                      <FormControl.ErrorMessage message={formik.errors.client_image_alt} />
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

export type { ProjectReviewFormModalShape }

export default ProjectReviewFormModal
