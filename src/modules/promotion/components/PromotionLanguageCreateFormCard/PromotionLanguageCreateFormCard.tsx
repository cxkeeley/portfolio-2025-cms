import { Form, Formik, FormikHelpers } from 'formik'
import { FC, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { ID } from '@models/base'
import { Option } from '@models/option'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { TextInputField } from '@components/Form/TextInput'
import { TextareaField } from '@components/Form/Textarea'
import FormControl from '@components/FormControl/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'

import { PermissionEnum } from '@/constants/permission'
import { PermissionsControl } from '@/modules/permissions'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormShape } from '@/utils/formUtil'

import PromotionLanguageSelectField from '../PromotionLanguageSelectField/PromotionLanguageSelectField'

type PromotionLanguageCreateFormCardShape = FormShape<{
  language_id: Option
  lead: string
  reference: string
  title: string
}>

type Props = {
  promotionId: ID
  initialValues?: PromotionLanguageCreateFormCardShape
  onSubmit: (values: PromotionLanguageCreateFormCardShape) => Promise<void>
  onCancel: () => void
}

const PromotionLanguageCreateFormCard: FC<Props> = ({ initialValues, promotionId, onSubmit, onCancel }) => {
  const [error, setError] = useState<string>()

  const handleSubmit = async (
    values: PromotionLanguageCreateFormCardShape,
    helpers: FormikHelpers<PromotionLanguageCreateFormCardShape>
  ) => {
    try {
      helpers.setSubmitting(true)
      await onSubmit(values)
    } catch (err) {
      if (AxiosUtil.isAxiosError(err)) {
        const errors = FormUtil.parseErrorResponse(err.response?.data.errors)
        if (errors) {
          return helpers.setErrors(errors)
        }
        setError(err.response?.data.message)
      } else {
        setError(String(err))
      }
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <KTCard>
      <Formik<PromotionLanguageCreateFormCardShape>
        onSubmit={handleSubmit}
        initialValues={{
          ...initialValues,
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <KTCard.Body>
              <AlertErrorForm
                show={!!error}
                message={error ?? ''}
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
                        <FormattedMessage id="promotion_language.label.title" />
                      </FormControl.Label>
                      <TextInputField name="title" />
                      <FormControl.ErrorMessage message={formik.errors.title} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="model.language" />
                      </FormControl.Label>
                      <PermissionsControl
                        allow={PermissionEnum.ADMIN_LANGUAGE_OPTION_FOR_PROMOTION_LANGUAGE_FORM}
                        renderError
                      >
                        <PromotionLanguageSelectField
                          name="language_id"
                          promotionId={promotionId}
                        />
                      </PermissionsControl>
                      <FormControl.ErrorMessage message={formik.errors.language_id} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="promotion_language.label.lead" />
                      </FormControl.Label>
                      <TextInputField name="lead" />
                      <FormControl.ErrorMessage message={formik.errors.lead} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="promotion_language.label.reference" />
                      </FormControl.Label>
                      <TextareaField
                        name="reference"
                        rows={5}
                      />
                      <FormControl.ErrorMessage message={formik.errors.reference} />
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

export type { PromotionLanguageCreateFormCardShape }

export default PromotionLanguageCreateFormCard
