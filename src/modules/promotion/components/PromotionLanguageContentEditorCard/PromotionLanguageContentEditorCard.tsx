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

import { ID } from '@models/base'

import { KTCard } from '@components/KTCard'

import StringUtil from '@/utils/stringUtil'
import { PromotionLanguageImageModel } from '@/models/promotionLanguageImage'
import AdminPromotionLanguageImagesAPI from '@/api/admin/promotionLanguageImagesAPI'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

type Props = {
  promotionLanguageId: ID
  images: Array<PromotionLanguageImageModel> | null
  defaultContent: string | null
  readOnly?: boolean
  onChange: (value: string) => void
}

const ReactEditorJS = createReactEditorJS()

const PromotionLanguageContentEditorCard: FC<Props> = ({
  promotionLanguageId,
  defaultContent,
  readOnly,
  images,
  onChange,
}) => {
  const intl = useIntl()
  const alert = useAlert()
  const prevContentBlockHash = useRef<string>()

  const initialContent = useMemo<OutputData | undefined>(() => {
    if (defaultContent) {
      return JSON.parse(defaultContent) as OutputData
    }
  }, [defaultContent])

  const contentImages = useMemo<Record<string, PromotionLanguageImageModel>>(() => {
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
      return contentImages[fileId].file?.link
    },
    [contentImages]
  )

  const imageUploader = useCallback(
    async (file: File) => {
      try {
        const response = await AdminPromotionLanguageImagesAPI.uploadImage({
          file,
          promotion_language_id: promotionLanguageId,
        })
        const image = response.data.data?.promotion_language_image
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
      } catch (err) {
        if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
          alert.error({ text: err.response.data.message })
        } else {
          alert.error({ text: String(err) })
        }
      }
    },
    [alert, contentImages, promotionLanguageId]
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
          <FormattedMessage id="promotion_language.label.content" />
        </KTCard.Title>
      </KTCard.Header>

      <KTCard.Body className="py-20">
        <ReactEditorJS
          holder="promotion_language_content"
          tools={tools}
          readOnly={readOnly}
          defaultValue={initialContent}
          onChange={handleSaveContent}
          onInitialize={handleInitialize}
          placeholder={intl.formatMessage({ id: 'promotion.placeholder.empty_promotion_language_content' })}
        />
      </KTCard.Body>
    </KTCard>
  )
}

export default PromotionLanguageContentEditorCard
