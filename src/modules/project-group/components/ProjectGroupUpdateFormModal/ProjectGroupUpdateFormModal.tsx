import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import AdminCategoryAPI from '@api/admin/categoriesAPI'

import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import FormControl from '@components/FormControl/FormControl'

import { PROJECT_GROUP_IMAGE_ASPECT_RATIO, PROJECT_GROUP_IMAGE_MIN_WIDTH } from '@modules/project-group/constants'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type ProjectGroupUpdateFormModalShape = FormShape<{
  image_file_path: string
}>

type ProjectGroupUpdateFormModalProps = {
  isShow: boolean
  modalTitle: React.ReactNode
  initialValues?: Partial<ProjectGroupUpdateFormModalShape>
  initialImageSrc?: string
  onSubmit: (values: ProjectGroupUpdateFormModalShape) => Promise<void>
  onCancel: () => void
}

const defaultValues: ProjectGroupUpdateFormModalShape = {
  image_file_path: '',
}

const ProjectGroupUpdateFormModal: FC<ProjectGroupUpdateFormModalProps> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <Modal
      size="lg"
      centered
      show={props.isShow}
      onHide={props.onCancel}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h3">{props.modalTitle}</Modal.Title>
      </Modal.Header>

      <Formik<ProjectGroupUpdateFormModalShape>
        initialValues={props.initialValues ?? defaultValues}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            setSubmitting(true)
            await props.onSubmit(values)
          } catch (err) {
            if (AxiosUtil.isAxiosError(err)) {
              const errors = FormUtil.parseErrorResponse(err.response?.data.errors)
              if (errors) {
                setErrors(errors)
              } else {
                setError(err.response?.data.message || err.message)
              }
            } else {
              alert.error({ text: String(err) })
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ handleSubmit, isSubmitting, dirty, errors }) => (
          <Form
            onSubmit={handleSubmit}
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

              <FormControl>
                <FormControl.Label isRequired>
                  <FormattedMessage id="category.form.banner_image" />
                </FormControl.Label>
                <ImageUploadField
                  name="image_file_path"
                  maxFileSize={1 * 1024 * 1024} // 1 MB
                  cropWidth={PROJECT_GROUP_IMAGE_MIN_WIDTH}
                  cropHeight={PROJECT_GROUP_IMAGE_MIN_WIDTH / PROJECT_GROUP_IMAGE_ASPECT_RATIO}
                  minResolutionWidth={PROJECT_GROUP_IMAGE_MIN_WIDTH}
                  minResolutionHeight={PROJECT_GROUP_IMAGE_MIN_WIDTH / PROJECT_GROUP_IMAGE_ASPECT_RATIO}
                  aspectRatio={PROJECT_GROUP_IMAGE_ASPECT_RATIO}
                  cropperModalTitle={<FormattedMessage id="category.form.adjust_banner_image" />}
                  initialImageSrc={props.initialImageSrc}
                  accessor={(r) => r.data.data?.path}
                  uploadFn={AdminCategoryAPI.uploadImage}
                />
                <FormControl.ErrorMessage message={errors.image_file_path} />
              </FormControl>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                theme="light"
                onClick={props.onCancel}
                disabled={isSubmitting}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                theme="primary"
                type="submit"
                disabled={!dirty}
                isLoading={isSubmitting}
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

export type { ProjectGroupUpdateFormModalShape }

export default ProjectGroupUpdateFormModal
