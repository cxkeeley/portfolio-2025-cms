/* eslint-disable import/no-extraneous-dependencies */
import { API, OutputData } from '@editorjs/editorjs'
import HeaderTool from '@editorjs/header'
import ListTool from '@editorjs/list'
import ParagraphTool from '@editorjs/paragraph'
import ImageTool from '@gwsmedika/editor-js-image'
import debounce from 'lodash.debounce'
import { FC, useCallback, useMemo, useRef } from 'react'
import { createReactEditorJS } from 'react-editor-js'
import { FormattedMessage, useIntl } from 'react-intl'

import AdminArticleLanguageImagesAPI from '@api/admin/articleLaguageImagesAPI'

import ArticleLanguageImageModel from '@models/articleLanguageImage'
import { ID } from '@models/base'

import { KTCard } from '@components/KTCard'

import StringUtil from '@/utils/stringUtil'

type Props = {
  articleLanguageId: ID
  images: Array<ArticleLanguageImageModel> | null
  defaultContent: string | null
  readOnly?: boolean
  onChange: (value: string) => void
}

const ReactEditorJS = createReactEditorJS()

const ArticleContentEditorCard: FC<Props> = ({ articleLanguageId, defaultContent, readOnly, images, onChange }) => {
  const intl = useIntl()
  const prevContentBlockHash = useRef<string>()

  const initialContent = useMemo<OutputData | undefined>(() => {
    if (defaultContent) {
      return JSON.parse(defaultContent) as OutputData
    }
  }, [defaultContent])

  const contentImages = useMemo<Record<string, ArticleLanguageImageModel>>(() => {
    if (images) {
      return images?.reduce((prev, next) => {
        prev[next.file_id] = next
        return prev
      }, Object())
    }
    return {}
  }, [images])

  const handleSaveContent = debounce(async (api: API) => {
    if (api) {
      const rawContent = await api.saver.save()
      const content = JSON.stringify(rawContent)

      const currentContentHash = await StringUtil.textToSha256HashHex(JSON.stringify(rawContent.blocks))

      if (prevContentBlockHash.current !== currentContentHash) {
        onChange(content)
        prevContentBlockHash.current = currentContentHash
      }
    }
  }, 2000)

  const handleInitialize = async () => {
    prevContentBlockHash.current = initialContent?.blocks
      ? await StringUtil.textToSha256HashHex(JSON.stringify(initialContent.blocks))
      : undefined
  }

  const imageLoader = useCallback(
    (fileId: ID) => {
      return contentImages[fileId].file.link
    },
    [contentImages]
  )

  const imageUploader = useCallback(
    async (file: File) => {
      const response = await AdminArticleLanguageImagesAPI.uploadImage({
        file,
        article_language_id: articleLanguageId,
      })
      const image = response.data.data?.article_language_image
      if (image) {
        contentImages[image.file_id] = image
        return {
          success: 1,
          file: {
            file_id: image.file_id,
            width: image.width_px,
            height: image.height_px,
          },
        }
      }
    },
    [articleLanguageId, contentImages]
  )

  const tools = useMemo(
    () => ({
      paragraph: {
        class: ParagraphTool,
        inlineToolbar: true,
        config: {
          preserveBlank: true,
        },
      },
      header: {
        class: HeaderTool,
        config: {
          defaultLevel: 3,
        },
      },
      list: {
        class: ListTool,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered',
        },
      },
      image: {
        class: ImageTool,
        config: {
          loader: imageLoader,
          uploader: imageUploader,
        },
      },
    }),
    [imageLoader, imageUploader]
  )

  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="article.card.article_content_title" />
        </KTCard.Title>
      </KTCard.Header>

      <KTCard.Body className="py-20">
        <ReactEditorJS
          tools={tools}
          readOnly={readOnly}
          defaultValue={initialContent}
          onChange={handleSaveContent}
          onInitialize={handleInitialize}
          placeholder={intl.formatMessage({ id: 'article.form.article_content_placeholder' })}
        />
      </KTCard.Body>
    </KTCard>
  )
}

export default ArticleContentEditorCard
