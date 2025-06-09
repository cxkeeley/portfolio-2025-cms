/* eslint-disable import/no-extraneous-dependencies */
import { API, OutputData } from '@editorjs/editorjs'
import ListTool from '@editorjs/list'
import ParagraphTool from '@editorjs/paragraph'
import debounce from 'lodash.debounce'
import { FC, useMemo, useRef } from 'react'
import { createReactEditorJS } from 'react-editor-js'
import { FormattedMessage, useIntl } from 'react-intl'

import { KTCard } from '@components/KTCard'

import StringUtil from '@/utils/stringUtil'
import { ID } from '@models/base'

type Props = {
  promotionLanguageId: ID
  defaultContent: string | null
  readOnly?: boolean
  onChange: (value: string) => void
}

const ReactEditorJS = createReactEditorJS()

const PromotionLanguageTermAndConditionEditorCard: FC<Props> = ({
  promotionLanguageId,
  defaultContent,
  readOnly,
  onChange,
}) => {
  const intl = useIntl()
  const prevContentBlockHash = useRef<string>()

  const initialContent = useMemo<OutputData | undefined>(() => {
    if (defaultContent) {
      return JSON.parse(defaultContent) as OutputData
    }
  }, [defaultContent])

  const handleSaveContent = debounce(async (api: API) => {
    const rawContent = await api.saver.save()

    const content = JSON.stringify(rawContent)

    const currentContentHash = await StringUtil.textToSha256HashHex(JSON.stringify(rawContent.blocks))

    if (prevContentBlockHash.current !== currentContentHash) {
      onChange(content)
      prevContentBlockHash.current = currentContentHash
    }
  }, 2000)

  const handleInitialize = async () => {
    prevContentBlockHash.current = initialContent?.blocks
      ? await StringUtil.textToSha256HashHex(JSON.stringify(initialContent.blocks))
      : undefined
  }

  const tools = useMemo(
    () => ({
      paragraph: {
        class: ParagraphTool,
        inlineToolbar: true,
        config: {
          preserveBlank: true,
        },
      },
      list: {
        class: ListTool,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered',
        },
      },
    }),
    []
  )

  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="promotion_language.label.term_and_conditions" />
        </KTCard.Title>
      </KTCard.Header>

      <KTCard.Body className="py-20">
        <ReactEditorJS
          holder="promotion_language_term_and_conditions"
          key={promotionLanguageId}
          tools={tools}
          readOnly={readOnly}
          defaultValue={initialContent}
          onChange={handleSaveContent}
          onInitialize={handleInitialize}
          placeholder={intl.formatMessage({ id: 'promotion.placeholder.empty_promotion_language_term_and_conditions' })}
        />
      </KTCard.Body>
    </KTCard>
  )
}

export default PromotionLanguageTermAndConditionEditorCard
