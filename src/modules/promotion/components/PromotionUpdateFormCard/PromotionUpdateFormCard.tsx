import AdminPromotionsAPI from '@/api/admin/promotionsAPI'
import AlertErrorForm from '@/components/AlertErrorForm'
import { Button } from '@/components/Button'
import { ImageUploadField } from '@/components/Form/ImageUpload'
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
import { FormSection } from '@/components/FormSection'
import { PermissionsControl } from '@/modules/permissions'
import { PermissionEnum } from '@/constants/permission'
import { TextInputField } from '@components/Form/TextInput'

type PromotionUpdateFormCardShape = FormShape<{
  image_file_path: string
  whatsapp_text: string
}>

type Props = {
  initialValues?: PromotionUpdateFormCardShape
  initialImageSrc?: string
  onSubmit: (values: PromotionUpdateFormCardShape) => Promise<void>
  onCancel: () => void
}

const PromotionUpdateFormCard: FC<Props> = ({ initialValues, initialImageSrc, onSubmit, onCancel }) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <KTCard>
      <Formik<PromotionUpdateFormCardShape>
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
                isEndOfChild
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
                          initialImageSrc={initialImageSrc}
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

export type { PromotionUpdateFormCardShape }

export default PromotionUpdateFormCard
