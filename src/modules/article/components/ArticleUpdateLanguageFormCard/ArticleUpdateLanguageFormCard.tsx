import { Form, Formik, FormikHelpers } from 'formik'
import { FC, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import { ID } from '@models/base'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { TextInputField } from '@components/Form/TextInput'
import { TextareaField } from '@components/Form/Textarea'
import FormControl from '@components/FormControl/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'

import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

type ArticleUpdateLanguageFormShape = {
  image_caption: string | null
  lead: string | null
  reference: string | null
  slug: string
  title: string
}

type Props = {
  articleId: ID
  initialValues?: ArticleUpdateLanguageFormShape
  onSubmit: (values: ArticleUpdateLanguageFormShape) => Promise<void>
  onCancel: () => void
}

const ArticleUpdateLanguageFormCard: FC<Props> = ({ initialValues, articleId, onSubmit, onCancel }) => {
  const intl = useIntl()
  const [error, setError] = useState<string>()

  const initial: ArticleUpdateLanguageFormShape = {
    image_caption: null,
    reference: null,
    lead: null,
    slug: '',
    title: '',
  }

  const handleSubmit = async (
    values: ArticleUpdateLanguageFormShape,
    helpers: FormikHelpers<ArticleUpdateLanguageFormShape>
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
      <Formik<ArticleUpdateLanguageFormShape>
        onSubmit={handleSubmit}
        initialValues={{
          ...initial,
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
                title={intl.formatMessage({ id: 'article.form.section_general_title' })}
                description={intl.formatMessage({ id: 'article.form.section_general_description' })}
                isEndOfChild
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="article_language.label.title" />
                      </FormControl.Label>
                      <TextInputField name="title" />
                      <FormControl.ErrorMessage message={formik.errors.title} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="article_language.label.slug" />
                      </FormControl.Label>
                      <TextInputField name="slug" />
                      <FormControl.ErrorMessage message={formik.errors.slug} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="article_language.label.image_caption" />
                      </FormControl.Label>
                      <TextInputField name="image_caption" />
                      <FormControl.ErrorMessage message={formik.errors.image_caption} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="article_language.label.lead" />
                      </FormControl.Label>
                      <TextareaField
                        name="lead"
                        rows={5}
                      />
                      <FormControl.ErrorMessage message={formik.errors.lead} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="article_language.label.reference" />
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

export type { ArticleUpdateLanguageFormShape }

export default ArticleUpdateLanguageFormCard
