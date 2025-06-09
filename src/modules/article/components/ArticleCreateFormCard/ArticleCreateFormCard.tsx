import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import AdminArticlesAPI from '@api/admin/articlesAPI'

import { Option } from '@models/option'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import { TextInputField } from '@components/Form/TextInput'
import { TextareaField } from '@components/Form/Textarea'
import FormControl from '@components/FormControl/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'

import { DEFAULT_LANGUAGE } from '@/constants/constant'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

import ArticleCategorySelectField from '../ArticleCategorySelectField'

type ArticleCreateFormShape = {
  author_name: string
  default_title: string
  image_file_path: string
  category_id: Option | null
  default_image_caption: string | null
  default_lead: string | null
  default_reference: string | null
  reviewer: string | null
}

type Props = {
  initialValues?: ArticleCreateFormShape
  onSubmit: (values: ArticleCreateFormShape) => Promise<unknown>
  onCancel: () => void
}

const ArticleCreateFormCard: FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  const intl = useIntl()
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <KTCard>
      <Formik<ArticleCreateFormShape>
        initialValues={{
          author_name: '',
          image_file_path: '',
          reviewer: null,
          category_id: null,
          default_image_caption: null,
          default_lead: null,
          default_reference: null,
          default_title: '',
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
          <Form onSubmit={formik.handleSubmit}>
            <KTCard.Body>
              <AlertErrorForm
                show={!!error}
                message={error!}
                className="mb-10"
              />

              <FormSection
                title={intl.formatMessage({ id: 'article.form.section_general_title' })}
                description={intl.formatMessage({ id: 'article.form.section_general_description' })}
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="article_language.label.image" />
                      </FormControl.Label>
                      <ImageUploadField
                        name="image_file_path"
                        uploadFn={AdminArticlesAPI.uploadImage}
                        accessor={({ data }) => data.data?.path}
                        cropWidth={600}
                        maxFileSize={1 * 1024 * 1024} // 1 MB
                        minResolutionWidth={600}
                        minResolutionHeight={(600 * 2) / 3}
                        aspectRatio={3 / 2}
                      />
                      <FormControl.ErrorMessage message={formik.errors.image_file_path} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="article.label.author_name" />
                      </FormControl.Label>
                      <TextInputField name="author_name" />
                      <FormControl.ErrorMessage message={formik.errors.author_name} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="article.label.reviewer" />
                      </FormControl.Label>
                      <TextInputField name="reviewer" />
                      <FormControl.ErrorMessage message={formik.errors.reviewer} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="model.category" />
                      </FormControl.Label>
                      <ArticleCategorySelectField name="category_id" />
                      <FormControl.ErrorMessage message={formik.errors.category_id} />
                    </FormControl>
                  </Col>
                </Row>
              </FormSection>

              <FormSection
                title={intl.formatMessage({ id: 'article.form.section_default_title' })}
                description={intl.formatMessage({ id: 'article.form.section_default_description' })}
                isEndOfChild
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="article_language.label.title" /> ({DEFAULT_LANGUAGE})
                      </FormControl.Label>
                      <TextInputField name="default_title" />
                      <FormControl.ErrorMessage message={formik.errors.default_title} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="article_language.label.image_caption" /> ({DEFAULT_LANGUAGE})
                      </FormControl.Label>
                      <TextInputField name="default_image_caption" />
                      <FormControl.ErrorMessage message={formik.errors.default_image_caption} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="article_language.label.lead" /> ({DEFAULT_LANGUAGE})
                      </FormControl.Label>
                      <TextareaField
                        name="default_lead"
                        rows={5}
                      />
                      <FormControl.ErrorMessage message={formik.errors.default_lead} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="article_language.label.reference" /> ({DEFAULT_LANGUAGE})
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

export type { ArticleCreateFormShape }

export default ArticleCreateFormCard
