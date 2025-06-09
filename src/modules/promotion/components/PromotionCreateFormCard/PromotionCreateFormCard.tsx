import AdminPromotionsAPI from '@/api/admin/promotionsAPI'
import AlertErrorForm from '@/components/AlertErrorForm'
import { Button } from '@/components/Button'
import { ImageUploadField } from '@/components/Form/ImageUpload'
import { TextInputField } from '@/components/Form/TextInput'
import { KTCard } from '@/components/KTCard'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormShape } from '@/utils/formUtil'
import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  PROMOTION_IMAGE_THUMBNAIL_ASPECT_RATIO,
  PROMOTION_IMAGE_THUMBNAIL_CROP_WIDTH,
  PROMOTION_IMAGE_THUMBNAIL_MAX_FILE_SIZE,
  PROMOTION_IMAGE_THUMBNAIL_MIN_RESOLUTION_HEIGHT,
  PROMOTION_IMAGE_THUMBNAIL_MIN_RESOLUTION_WIDTH,
} from '../../constants'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormControl } from '@/components/FormControl'
import { DEFAULT_LANGUAGE } from '@/constants/constant'
import { FormSection } from '@/components/FormSection'
import { PermissionsControl } from '@/modules/permissions'
import { PermissionEnum } from '@/constants/permission'
import { TextareaField } from '@components/Form/Textarea'

type PromotionCreateFormCardShape = FormShape<{
  default_lead: string
  default_reference: string
  default_title: string
  image_file_path: string
  whatsapp_text: string
}>

type Props = {
  initialValues?: PromotionCreateFormCardShape
  onSubmit: (values: PromotionCreateFormCardShape) => Promise<void>
  onCancel: () => void
}

const PromotionCreateFormCard: FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <KTCard>
      <Formik<PromotionCreateFormCardShape>
        initialValues={{
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
                setError(err.response?.data.message)
              }
            } else {
              alert.error({ text: String(err) })
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {(formik) => (
          <Form
            className="form"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <KTCard.Body>
              <AlertErrorForm
                show={!!error}
                message={error!}
                className="mb-10"
              />

              <FormSection
                title={<FormattedMessage id="promotion.form.section_general_title" />}
                description={<FormattedMessage id="promotion.form.section_general_description" />}
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="promotion.label.image" />
                      </FormControl.Label>
                      <PermissionsControl
                        allow={PermissionEnum.ADMIN_PROMOTION_UPLOAD_IMAGE}
                        renderError
                      >
                        <ImageUploadField
                          name="image_file_path"
                          uploadFn={AdminPromotionsAPI.uploadImage}
                          accessor={({ data }) => data.data?.path}
                          cropWidth={PROMOTION_IMAGE_THUMBNAIL_CROP_WIDTH}
                          maxFileSize={PROMOTION_IMAGE_THUMBNAIL_MAX_FILE_SIZE} // 1 MB
                          minResolutionWidth={PROMOTION_IMAGE_THUMBNAIL_MIN_RESOLUTION_WIDTH}
                          minResolutionHeight={PROMOTION_IMAGE_THUMBNAIL_MIN_RESOLUTION_HEIGHT}
                          aspectRatio={PROMOTION_IMAGE_THUMBNAIL_ASPECT_RATIO}
                        />
                      </PermissionsControl>
                      <FormControl.ErrorMessage message={formik.errors.image_file_path} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="promotion.label.whatsapp_text" />
                      </FormControl.Label>
                      <TextInputField name="whatsapp_text" />
                      <FormControl.ErrorMessage message={formik.errors.whatsapp_text} />
                    </FormControl>
                  </Col>
                </Row>
              </FormSection>

              <FormSection
                title={<FormattedMessage id="promotion.form.section_default_title" />}
                description={<FormattedMessage id="promotion.form.section_default_description" />}
                isEndOfChild
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="promotion_language.label.title" /> ({DEFAULT_LANGUAGE})
                      </FormControl.Label>
                      <TextInputField name="default_title" />
                      <FormControl.ErrorMessage message={formik.errors.default_title} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="promotion_language.label.lead" /> ({DEFAULT_LANGUAGE})
                      </FormControl.Label>
                      <TextInputField name="default_lead" />
                      <FormControl.ErrorMessage message={formik.errors.default_lead} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="promotion_language.label.reference" /> ({DEFAULT_LANGUAGE})
                      </FormControl.Label>
                      <TextareaField
                        name="default_reference"
                        rows={5}
                      />
                      <FormControl.ErrorMessage message={formik.errors.default_reference} />
                    </FormControl>
                  </Col>
                </Row>
              </FormSection>
            </KTCard.Body>
            <KTCard.Footer className="d-flex justify-content-end gap-3">
              <Button
                theme="secondary"
                disabled={formik.isSubmitting}
                onClick={onCancel}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                type="submit"
                theme="primary"
                isLoading={formik.isSubmitting}
              >
                <FormattedMessage id="form.submit" />
              </Button>
            </KTCard.Footer>
          </Form>
        )}
      </Formik>
    </KTCard>
  )
}

export type { PromotionCreateFormCardShape }

export default PromotionCreateFormCard
