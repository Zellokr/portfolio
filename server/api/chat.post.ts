import Groq from 'groq-sdk'
import { queryCollection } from '@nuxt/content/server'
import { buildSystemPrompt, isRateLimited, validateMessages } from '../utils/chat'
import type { About, Agent, Hobby, Project, Technology, TimelineEntry } from '../utils/chat'

const MODEL = 'openai/gpt-oss-20b'
const MAX_TOKENS = 1024

const rateLimitLog = new Map<string, number[]>()

export default defineEventHandler(async (event) => {
  if (!process.env.GROQ_API_KEY) {
    throw createError({ statusCode: 503, statusMessage: 'Chat is not configured.' })
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (isRateLimited(rateLimitLog, ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Message limit reached. Please wait a few hours before trying again.' })
  }

  const body = await readBody(event)
  const messages = validateMessages(body)
  if (!messages) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body.' })
  }

  const [about, projects, timeline, technologies, agents, hobbies] = await Promise.all([
    queryCollection(event, 'about').first() as Promise<About | null>,
    queryCollection(event, 'projects').order('order', 'ASC').all() as Promise<Project[]>,
    queryCollection(event, 'timeline').order('order', 'ASC').all() as Promise<TimelineEntry[]>,
    queryCollection(event, 'technologies').order('order', 'ASC').all() as Promise<Technology[]>,
    queryCollection(event, 'agents').order('order', 'ASC').all() as Promise<Agent[]>,
    queryCollection(event, 'hobbies').order('order', 'ASC').all() as Promise<Hobby[]>
  ])

  const client = new Groq()
  const completion = await client.chat.completions.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      { role: 'system', content: buildSystemPrompt(about, projects, timeline, technologies, agents, hobbies) },
      ...messages
    ]
  })

  return {
    reply: completion.choices[0]?.message?.content ?? ''
  }
})
