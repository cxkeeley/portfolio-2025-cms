import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import AdminBannersAPI from '@api/admin/bannersAPI'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import { TextInputField } from '@components/Form/TextInput'
import { FormControl } from '@components/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'

import { BANNER_MIN_WIDTH, MOBILE_BANNER_ASPECT_RATIO } from '@modules/banner/constants'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormShape } from '@/utils/formUtil'

type BannerFormCardShape = FormShape<{
  image_file_path: string | null
  url: string
}>

type Props = {
  initialValues?: Partial<BannerFormCardShape>
  initialImageSrc?: string
  onSubmit: (values: BannerFormCardShape) => Promise<void>
  onCancel: () => void
}

const BannerFormCard: FC<Props> = ({ initialValues, onSubmit, onCancel, initialImageSrc }) => {
  const alert = useAlert()
  const intl = useIntl()
  const [error, setError] = useState<string>()

  const initialFormValues: BannerFormCardShape = {
    url: null,
    image_file_path: null,
    ...initialValues,
  }

  return (
    <KTCard>
      <Formik<BannerFormCardShape>
        initialValues={initialFormValues}
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
          <Form onSubmit={formik.handleSubmit}>
            <KTCard.Body className="py-0">
              <AlertErrorForm
                show={!!error}
                message={error!}
                className="mt-10"
              />

              <FormSection
                title={intl.formatMessage({ id: 'form.section_general_title' })}
                description={intl.formatMessage({ id: 'form.section_general_description' }, { model: 'banner' })}
                isEndOfChild
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="banner.model.image_file_path" />
                      </FormControl.Label>
                      <ImageUploadField
                        name="image_file_path"
                        accept={['.png', '.jpg', '.jpeg']}
                        initialImageSrc={initialImageSrc}
                        cropperModalTitle={<FormattedMessage id="banner.modal.cropper_image_title" />}
                        uploadFn={AdminBannersAPI.uploadImage}
                        accessor={({ data }) => data.data?.path}
                        maxFileSize={1 * 1024 * 1024}
                        cropWidth={BANNER_MIN_WIDTH}
                        cropHeight={BANNER_MIN_WIDTH / MOBILE_BANNER_ASPECT_RATIO}
                        minResolutionWidth={BANNER_MIN_WIDTH}
                        minResolutionHeight={BANNER_MIN_WIDTH / MOBILE_BANNER_ASPECT_RATIO}
                        aspectRatio={MOBILE_BANNER_ASPECT_RATIO}
                      />
                      <FormControl.ErrorMessage message={formik.errors.image_file_path} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="banner.model.url" />
                      </FormControl.Label>
                      <FormControl.Group variant="solid">
                        <TextInputField name="url" />
                      </FormControl.Group>
                      <FormControl.ErrorMessage message={formik.errors.url} />
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
                disabled={!formik.dirty}
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

export type { BannerFormCardShape }

export default BannerFormCard
