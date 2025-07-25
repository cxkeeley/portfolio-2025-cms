import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import AdminLocationServicesAPI from '@api/admin/projectServiceAPI'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { FileInputField } from '@components/Form/FileInput'
import { TextInputField } from '@components/Form/TextInput'
import { FormControl } from '@components/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'

import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormShape } from '@/utils/formUtil'

type LocationServiceFormCardShape = FormShape<{
  default_image_alt: string
  default_short_description: string
  default_title: string
  image_file_path: string
}>

type Props = {
  initialValues?: Partial<LocationServiceFormCardShape>
  onSubmit: (values: LocationServiceFormCardShape) => Promise<void>
  onCancel: () => void
}

const LocationServiceFormCard: FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const initialFormValues: LocationServiceFormCardShape = {
    image_file_path: null,
    ...initialValues,
  }

  return (
    <KTCard>
      <Formik<LocationServiceFormCardShape>
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
                title={<FormattedMessage id="form.section_general_title" />}
                description={
                  <FormattedMessage
                    id="form.section_general_description"
                    values={{
                      model: <FormattedMessage id="model.location_service" />,
                    }}
                  />
                }
                isEndOfChild
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="vocabulary.icon" />
                      </FormControl.Label>
                      <PermissionsControl allow={[PermissionEnum.ADMIN_LOCATION_SERVICE_UPLOAD_IMAGE]}>
                        <FileInputField
                          name="image_file_path"
                          accept=".svg"
                          uploadFn={AdminLocationServicesAPI.uploadImage}
                          accessor={({ data }) => data.data.path}
                        />
                      </PermissionsControl>
                      <FormControl.ErrorMessage message={formik.errors.image_file_path} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="location_service.label.default_title" />
                      </FormControl.Label>
                      <TextInputField name="default_title" />
                      <FormControl.ErrorMessage message={formik.errors.default_title} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="location_service.label.default_short_description" />
                      </FormControl.Label>
                      <TextInputField name="default_short_description" />
                      <FormControl.ErrorMessage message={formik.errors.default_short_description} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="location_service.label.default_image_alt" />
                      </FormControl.Label>
                      <TextInputField name="default_image_alt" />
                      <FormControl.ErrorMessage message={formik.errors.default_image_alt} />
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

export type { LocationServiceFormCardShape }

export default LocationServiceFormCard
