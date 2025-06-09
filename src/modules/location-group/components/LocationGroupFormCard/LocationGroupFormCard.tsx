import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import { FormControl } from '@components/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormShape } from '@/utils/formUtil'
import { LOCATION_GROUP_IMAGE_ASPECT_RATIO, LOCATION_GROUP_IMAGE_MIN_WIDTH } from '@modules/location-group/constants'
import AdminLocationGroupsAPI from '@api/admin/locationGroupsAPI'
import { TextInputField } from '@components/Form/TextInput'

type LocationGroupFormCardShape = FormShape<{
  image_file_path: string
  name: string
  image_alt: string
}>

type Props = {
  initialValues?: Partial<LocationGroupFormCardShape>
  initialImageSrc?: string
  onSubmit: (values: LocationGroupFormCardShape) => Promise<void>
  onCancel: () => void
}

const LocationGroupFormCard: FC<Props> = ({ initialValues, onSubmit, onCancel, initialImageSrc }) => {
  const alert = useAlert()
  const intl = useIntl()
  const [error, setError] = useState<string>()

  const initialFormValues: LocationGroupFormCardShape = {
    image_file_path: null,
    ...initialValues,
  }

  return (
    <KTCard>
      <Formik<LocationGroupFormCardShape>
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
                description={intl.formatMessage({ id: 'form.section_general_description' }, { model: 'location group' })}
                isEndOfChild
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="vocabulary.image" />
                      </FormControl.Label>
                      <ImageUploadField
                        name="image_file_path"
                        accept={['.png', '.jpg', '.jpeg']}
                        initialImageSrc={initialImageSrc}
                        cropperModalTitle={<FormattedMessage id="banner.modal.cropper_image_title" />}
                        uploadFn={AdminLocationGroupsAPI.uploadImage}
                        accessor={({ data }) => data.data?.path}
                        maxFileSize={1 * 1024 * 1024}
                        cropWidth={LOCATION_GROUP_IMAGE_MIN_WIDTH}
                        cropHeight={LOCATION_GROUP_IMAGE_MIN_WIDTH / LOCATION_GROUP_IMAGE_ASPECT_RATIO}
                        minResolutionWidth={LOCATION_GROUP_IMAGE_MIN_WIDTH}
                        minResolutionHeight={LOCATION_GROUP_IMAGE_MIN_WIDTH / LOCATION_GROUP_IMAGE_ASPECT_RATIO}
                        aspectRatio={LOCATION_GROUP_IMAGE_ASPECT_RATIO}
                      />
                      <FormControl.ErrorMessage message={formik.errors.image_file_path} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="location_group.label.default_name" />
                      </FormControl.Label>
                      <TextInputField name="default_name" />
                      <FormControl.ErrorMessage message={formik.errors.name} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="location_group.label.default_image_alt" />
                      </FormControl.Label>
                      <TextInputField name="default_image_alt" />
                      <FormControl.ErrorMessage message={formik.errors.image_alt} />
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

export type { LocationGroupFormCardShape }

export default LocationGroupFormCard
