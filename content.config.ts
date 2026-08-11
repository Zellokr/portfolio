import { defineCollection, defineContentConfig } from '@nuxt/content'
import { aboutSchema, projectSchema } from './content.schema'

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: projectSchema
    }),
    about: defineCollection({
      type: 'page',
      source: 'about.md',
      schema: aboutSchema
    })
  }
})
