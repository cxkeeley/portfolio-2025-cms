/* eslint-disable import/no-extraneous-dependencies */
import { API, OutputData } from '@editorjs/editorjs'
import HeaderTool from '@editorjs/header'
import ListTool from '@editorjs/list'
import ParagraphTool from '@editorjs/paragraph'
import debounce from 'lodash.debounce'
import { FC, useMemo, useRef } from 'react'
import { createReactEditorJS } from 'react-editor-js'
import { FormattedMessage, useIntl } from 'react-intl'

import { KTCard } from '@components/KTCard'

import StringUtil from '@/utils/stringUtil'

type Props = {
  defaultContent: string | null
  onChange: (content: string) => void
}

const ReactEditorJS = createReactEditorJS()

const DoctorContentEditorCard: FC<Props> = ({ defaultContent, onChange }) => {
  const intl = useIntl()
  const prevContentBlockHash = useRef<string>()

  const initialContent = useMemo<OutputData | undefined>(() => {
    if (defaultContent) {
      return JSON.parse(defaultContent) as OutputData
    }
  }, [defaultContent])

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
    }),
    []
  )

  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage id="vocabulary.content" />
        </KTCard.Title>
      </KTCard.Header>

      <KTCard.Body className="py-20">
        <ReactEditorJS
          tools={tools}
          defaultValue={initialContent}
          onChange={handleSaveContent}
          onInitialize={handleInitialize}
          placeholder={intl.formatMessage({ id: 'article.form.article_content_placeholder' })}
        />
      </KTCard.Body>
    </KTCard>
  )
}

export default DoctorContentEditorCard
