import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import AdminDoctorsAPI from '@api/admin/teamsAPI'

import { Option } from '@models/option'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import { TextInputField } from '@components/Form/TextInput'
import { ToggleSwitchField } from '@components/Form/ToggleSwitch'
import { FormControl } from '@components/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'

import { DOCTOR_IMAGE_ASPECT_RATIO, DOCTOR_IMAGE_WIDTH, DOCTOR_THUMBNAIL_IMAGE_WIDTH } from '@modules/doctor/constants'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

import DoctorLocationSelectField from '../DoctorLocationSelectField'
import DoctorStartPracticeMonthSelectField from '../DoctorStartPracticeMonthSelectField'

type DoctorUpdateFormShape = {
  degree: string | null
  slug: string
  image_file_path: string | null
  is_active: boolean | null
  job_title: string
  thumbnail_file_path: string | null
  name: string
  location_id: Option | null
  start_practice_month: Option | null
  start_practice_year: string
}

type Props = {
  initialValues?: Partial<DoctorUpdateFormShape>
  initialThubmnailSrc?: string
  initialImageSrc?: string
  onSubmit: (values: DoctorUpdateFormShape) => Promise<void>
  onCancel: () => void
}

const DoctorUpdateFormCard: FC<Props> = ({
  initialValues,
  onSubmit,
  onCancel,
  initialImageSrc,
  initialThubmnailSrc,
}) => {
  const alert = useAlert()
  const intl = useIntl()
  const [error, setError] = useState<string>()

  const initial: DoctorUpdateFormShape = {
    degree: '',
    slug: '',
    image_file_path: '',
    is_active: true,
    job_title: '',
    thumbnail_file_path: '',
    name: '',
    location_id: null,
    start_practice_month: null,
    start_practice_year: '0',
    ...initialValues,
  }

  return (
    <KTCard>
      <Formik<DoctorUpdateFormShape>
        initialValues={initial}
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
                className="mb-10"
              />

              <FormSection
                title={intl.formatMessage({ id: 'doctor.form.section_general_title' })}
                description={intl.formatMessage({ id: 'doctor.form.section_general_description' })}
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="vocabulary.slug" />
                      </FormControl.Label>
                      <TextInputField name="slug" />
                      <FormControl.ErrorMessage message={formik.errors.slug} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="doctor.label.name" />
                      </FormControl.Label>
                      <TextInputField name="name" />
                      <FormControl.ErrorMessage message={formik.errors.name} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="doctor.label.degree" />
                      </FormControl.Label>
                      <TextInputField name="degree" />
                      <FormControl.ErrorMessage message={formik.errors.degree} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="doctor.label.job_title" />
                      </FormControl.Label>
                      <TextInputField name="job_title" />
                      <FormControl.ErrorMessage message={formik.errors.job_title} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="doctor.label.location" />
                      </FormControl.Label>
                      <DoctorLocationSelectField
                        isClearable
                        name="location_id"
                      />
                      <FormControl.ErrorMessage message={formik.errors.location_id} />
                    </FormControl>
                  </Col>

                  <Row>
                    <Col xs={12}>
                      <FormControl>
                        <FormControl.Label>
                          <FormattedMessage id="doctor.label.start_practice" />
                        </FormControl.Label>
                        <Row>
                          <Col xs={3}>
                            <DoctorStartPracticeMonthSelectField name="start_practice_month" />
                            <FormControl.ErrorMessage message={formik.errors.start_practice_month} />
                          </Col>
                          <Col xs={2}>
                            <TextInputField
                              type="number"
                              name="start_practice_year"
                            />
                            <FormControl.ErrorMessage message={formik.errors.start_practice_year} />
                          </Col>
                        </Row>
                      </FormControl>
                    </Col>
                  </Row>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="doctor.label.active" />
                      </FormControl.Label>
                      <ToggleSwitchField name="is_active" />
                      <FormControl.ErrorMessage message={formik.errors.is_active} />
                    </FormControl>
                  </Col>
                </Row>
              </FormSection>

              <FormSection
                title={intl.formatMessage({ id: 'doctor.form.section_image_title' })}
                description={intl.formatMessage({ id: 'doctor.form.section_image_description' })}
                isEndOfChild
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="doctor.label.image" />
                      </FormControl.Label>
                      <ImageUploadField
                        name="image_file_path"
                        accept={['.png', '.jpeg', '.jpg']}
                        initialImageSrc={initialImageSrc}
                        cropperModalTitle={<FormattedMessage id="doctor.modal.cropper_image_title" />}
                        uploadFn={AdminDoctorsAPI.uploadImage}
                        accessor={({ data }) => data.data?.path}
                        cropWidth={DOCTOR_IMAGE_WIDTH}
                        maxFileSize={1 * 1024 * 1024} // 1 MB
                        minResolutionWidth={DOCTOR_IMAGE_WIDTH}
                        minResolutionHeight={DOCTOR_IMAGE_WIDTH / DOCTOR_IMAGE_ASPECT_RATIO}
                        aspectRatio={DOCTOR_IMAGE_ASPECT_RATIO}
                      />
                      <FormControl.ErrorMessage message={formik.errors.image_file_path} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="doctor.label.thumbnail" />
                      </FormControl.Label>
                      <ImageUploadField
                        name="thumbnail_file_path"
                        accept={['.png', '.jpeg', '.jpg']}
                        initialImageSrc={initialThubmnailSrc}
                        uploadFn={AdminDoctorsAPI.uploadImage}
                        cropperModalTitle={<FormattedMessage id="doctor.modal.cropper_image_title" />}
                        accessor={({ data }) => data.data?.path}
                        cropWidth={DOCTOR_THUMBNAIL_IMAGE_WIDTH}
                        maxFileSize={1 * 1024 * 1024} // 1 MB
                        minResolutionWidth={DOCTOR_THUMBNAIL_IMAGE_WIDTH}
                        minResolutionHeight={DOCTOR_THUMBNAIL_IMAGE_WIDTH / DOCTOR_IMAGE_ASPECT_RATIO}
                        aspectRatio={DOCTOR_IMAGE_ASPECT_RATIO}
                      />
                      <FormControl.ErrorMessage message={formik.errors.thumbnail_file_path} />
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

export type { DoctorUpdateFormShape }

export default DoctorUpdateFormCard
