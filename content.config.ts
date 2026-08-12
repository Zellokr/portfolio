import { defineCollection, defineContentConfig } from '@nuxt/content'
import { aboutSchema, agentSchema, projectSchema, technologySchema, timelineEntrySchema } from './content.schema'

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
    }),
    timeline: defineCollection({
      type: 'page',
      source: 'timeline/*.md',
      schema: timelineEntrySchema
    }),
    technologies: defineCollection({
      type: 'page',
      source: 'technologies/*.md',
      schema: technologySchema
    }),
    agents: defineCollection({
      type: 'page',
      source: 'agents/*.md',
      schema: agentSchema
    })
  }
})
