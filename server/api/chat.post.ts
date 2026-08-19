import Groq from 'groq-sdk'
import { queryCollection } from '@nuxt/content/server'
import {
  buildSystemPrompt,
  isRateLimitedPersistent,
  isTrustedOrigin,
  refundGlobalDailyBudget,
  refundRateLimit,
  reserveGlobalDailyBudget,
  validateMessages,
} from '../utils/chat'
import type { About, Agent, Hobby, Project, Technology, TimelineEntry } from '../utils/chat'

const MODEL = 'openai/gpt-oss-20b'
const MAX_TOKENS = 1024

export default defineEventHandler(async (event) => {
  if (!process.env.GROQ_API_KEY) {
    throw createError({ statusCode: 503, statusMessage: 'Chat is not configured.' })
  }

  const origin = getHeader(event, 'origin')
  const referer = getHeader(event, 'referer')
  if (!isTrustedOrigin(origin, referer, getRequestHost(event))) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden.' })
  }

  // Validate before consuming any budget so malformed requests are free.
  const body = await readBody(event)
  const messages = validateMessages(body)
  if (!messages) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body.' })
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (await isRateLimitedPersistent(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Message limit reached. Please wait a few hours before trying again.' })
  }

  // Shared daily ceiling across all visitors — protects the Groq quota so an
  // earlier surge can't leave this visitor with a chat that fails on send.
  if (!(await reserveGlobalDailyBudget())) {
    await refundRateLimit(ip)
    throw createError({
      statusCode: 503,
      statusMessage: 'El asistente ha alcanzado su límite diario. Vuelve mañana.',
      data: { code: 'daily_limit' },
    })
  }

  try {
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
  } catch {
    // Groq is unavailable (quota exhausted, network, upstream error…). Refund
    // both budgets so this failed attempt doesn't count against the visitor or
    // the shared daily cap, and tell the UI the assistant is unavailable.
    await refundGlobalDailyBudget()
    await refundRateLimit(ip)
    throw createError({
      statusCode: 503,
      statusMessage: 'El asistente no está disponible ahora mismo. Inténtalo más tarde.',
      data: { code: 'assistant_unavailable' },
    })
  }
})
