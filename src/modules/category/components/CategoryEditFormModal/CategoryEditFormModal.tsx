import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import AdminCategoryAPI from '@api/admin/categoriesAPI'

import { FileModel } from '@models/file'

import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import FormControl from '@components/FormControl/FormControl'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type CategoryEditFormModalShape = {
  image_file_path: string
}

type CategoryEditFormModalProps = {
  show: boolean
  initialValues?: Partial<CategoryEditFormModalShape>
  initialBannerImage?: FileModel
  onSubmit: (values: CategoryEditFormModalShape) => Promise<void>
  onCancel: () => void
}

const CategoryEditFormModal: FC<CategoryEditFormModalProps> = ({
  show,
  initialValues,
  initialBannerImage,
  onSubmit,
  onCancel,
}) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <Modal
      size="lg"
      centered
      show={show}
      onHide={onCancel}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FormattedMessage id="category.modal.edit_category_title" />
        </Modal.Title>
      </Modal.Header>

      <Formik<CategoryEditFormModalShape>
        initialValues={{
          image_file_path: '',
          ...initialValues,
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            setSubmitting(true)

            await onSubmit(values)
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
                  cropWidth={1200}
                  maxFileSize={1 * 1024 * 1024} // 1 MB
                  minResolutionWidth={1200}
                  minResolutionHeight={(1200 * 5) / 16}
                  aspectRatio={16 / 5}
                  uploadFn={AdminCategoryAPI.uploadImage}
                  accessor={(r) => r.data.data?.path}
                  cropperModalTitle={<FormattedMessage id="category.form.adjust_banner_image" />}
                  initialImageSrc={initialBannerImage?.link}
                />
                <FormControl.ErrorMessage message={errors.image_file_path} />
              </FormControl>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                theme="light"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                theme="primary"
                type="submit"
                disabled={isSubmitting || !dirty}
                data-kt-indicator={isSubmitting ? 'on' : 'off'}
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

export type { CategoryEditFormModalProps, CategoryEditFormModalShape }

export default CategoryEditFormModal
