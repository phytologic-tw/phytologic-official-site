import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'h3rw3ofo',
  dataset: 'production',
  apiVersion: '2024-08-01',
  useCdn: true,
})

const POST_QUERY = `*[_type == "post" && reviewStatus == "published"] | order(publishedDate desc) {
  title,
  "slug": slug.current,
  category,
  publishedDate,
  featured,
  "posterImageUrl": posterImage.asset->url,
  body,
  requiresReview,
  reviewStatus
}`

export async function fetchJournalEntries() {
  return sanityClient.fetch(POST_QUERY)
}
