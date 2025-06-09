import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormattedMessage } from 'react-intl'

import AdminCategoryAPI from '@api/admin/categoriesAPI'

import { FileModel } from '@models/file'
import { LanguageCodeEnum } from '@models/language'

import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import { TextInputField } from '@components/Form/TextInput'
import FormControl from '@components/FormControl/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

export type CategoryCreateFormShape = {
  image_file_path: string
  default_name: string
}

export type CategoryCreateFormProps = {
  initialValues?: Partial<CategoryCreateFormShape>
  initialBannerImage?: FileModel
  onSubmit: (values: CategoryCreateFormShape) => Promise<void>
  onCancel: () => void
}

const CategoryCreateForm: FC<CategoryCreateFormProps> = ({ initialValues, initialBannerImage, onSubmit, onCancel }) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <Formik<CategoryCreateFormShape>
      initialValues={{
        image_file_path: '',
        default_name: '',
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
          <KTCard>
            <KTCard.Body>
              <Alert
                show={TypeUtil.isDefined(error)}
                variant="danger"
                className="p-5 mb-10"
              >
                {error}
              </Alert>

              <FormSection
                title={<FormattedMessage id="form.section_required_title" />}
                description={<FormattedMessage id="form.section_required_description" />}
                isEndOfChild
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="category.form.default_name" /> ({LanguageCodeEnum.ID.toUpperCase()})
                      </FormControl.Label>
                      <TextInputField name="default_name" />
                      <FormControl.ErrorMessage message={errors.default_name} />
                    </FormControl>
                  </Col>

                  <Col xs={8}>
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
                  </Col>
                </Row>
              </FormSection>
            </KTCard.Body>

            <KTCard.Footer className="d-flex justify-content-end gap-3 py-6 px-9">
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
            </KTCard.Footer>
          </KTCard>
        </Form>
      )}
    </Formik>
  )
}

export default CategoryCreateForm
