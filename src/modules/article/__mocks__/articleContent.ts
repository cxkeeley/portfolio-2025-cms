import { ArticleContentModel } from '@models/article'

const articleContent: ArticleContentModel = {
  time: 1635603431943,
  blocks: [
    {
      id: 'sheNwCUP5A',
      type: 'header',
      data: {
        text: 'Editor.js',
        level: 2,
      },
    },
    {
      id: '12iM3lqzcm',
      type: 'paragraph',
      data: {
        text: 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.',
      },
    },
    {
      id: 'xnPuiC9Z8M',
      type: 'list',
      data: {
        style: 'ordered',
        items: [
          'It is a block-styled editor',
          'It returns clean data output in JSON',
          'Designed to be extendable and pluggable with a simple API',
        ],
      },
    },
    {
      id: '12iM3lqzcm',
      type: 'paragraph',
      data: {
        text: 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.',
      },
    },
    {
      id: 'xnPuiC9Z8M',
      type: 'list',
      data: {
        style: 'unordered',
        items: [
          'It is a block-styled editor',
          'It returns clean data output in JSON',
          'Designed to be extendable and pluggable with a simple API',
        ],
      },
    },
    {
      id: 'FF1iyF3VwN',
      type: 'image',
      data: {
        file: {
          file_id: '0182309810928309128',
          width: 300,
          height: 100,
        },
        caption: '',
        withBorder: false,
        stretched: false,
        withBackground: false,
      },
    },
  ],
}

export default articleContent
