export default {
  name: 'post',
  title: '植本誌文章',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '標題',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug（網址代稱）',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: '分類',
      type: 'string',
      options: {
        list: [
          { title: '文章', value: 'article' },
          { title: '影片', value: 'video' },
          { title: '活動花絮', value: 'event' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'publishedDate',
      title: '發布日期',
      type: 'date',
      validation: Rule => Rule.required(),
    },
    {
      name: 'featured',
      title: '是否為輪播精選',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'posterImage',
      title: '封面圖',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: '內文',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'requiresReview',
      title: '是否需要健康內容審核',
      type: 'boolean',
      initialValue: false,
      description: '涉及健康功效宣稱的文章需勾選，發布前需經審核人核可',
    },
    {
      name: 'reviewStatus',
      title: '審核狀態',
      type: 'string',
      options: {
        list: [
          { title: '草稿', value: 'draft' },
          { title: '待審核', value: 'pending' },
          { title: '已發布', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'reviewStatus',
      media: 'posterImage',
    },
  },
}
