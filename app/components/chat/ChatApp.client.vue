<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import {
  MESSAGE_LIMIT,
  isLimitReached,
  loadChatUsage,
  recordChatMessage,
  remainingMessages,
  usageResetAt,
} from '~/utils/chatUsage'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<ChatMessage[]>([])
const inputValue = ref('')
const isSending = ref(false)
const errorText = ref('')
// Set when the backend reports the assistant is unavailable (Groq quota spent
// or the shared daily budget exhausted). Disables input until the page reloads.
const unavailable = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)
const scrollEl = ref<HTMLDivElement | null>(null)
const usage = ref(loadChatUsage(window.localStorage))

const remaining = computed(() => remainingMessages(usage.value))
const limitReached = computed(() => isLimitReached(usage.value))
const resetLabel = computed(() =>
  usageResetAt(usage.value).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }),
)

function focusInput(): void {
  inputEl.value?.focus()
}

function scrollToBottom(): void {
  if (scrollEl.value) {
    scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  }
}

watch(
  () => messages.value.length,
  () => nextTick(scrollToBottom),
)

async function submit(): Promise<void> {
  const text = inputValue.value.trim()
  if (!text || isSending.value || limitReached.value || unavailable.value) return

  errorText.value = ''
  messages.value.push({ role: 'user', content: text })
  inputValue.value = ''
  isSending.value = true

  try {
    const response = await $fetch<{ reply: string }>('/api/chat', {
      method: 'POST',
      body: { messages: [...messages.value] },
    })
    messages.value.push({ role: 'assistant', content: response.reply })
    // Only spend the visitor's allowance once the message is actually answered,
    // so a failed send never burns one of their messages.
    usage.value = recordChatMessage(window.localStorage, usage.value)
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode
    if (statusCode === 429) {
      errorText.value = 'Has alcanzado el límite de mensajes. Inténtalo de nuevo más tarde.'
    } else if (statusCode === 503) {
      unavailable.value = true
      errorText.value = 'El asistente no está disponible ahora mismo. Vuelve más tarde.'
    } else {
      errorText.value = 'No se pudo enviar el mensaje. Inténtalo de nuevo en un momento.'
    }
  } finally {
    isSending.value = false
    nextTick(focusInput)
  }
}

onMounted(focusInput)
</script>

<template>
  <div class="flex h-[26rem] flex-col gap-3 p-4 text-sm">
    <div ref="scrollEl" class="flex-1 space-y-3 overflow-y-auto">
      <p v-if="messages.length === 0" class="text-gray-500">
        Pregúntame lo que quieras sobre mí, mi experiencia o mis proyectos.
      </p>
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="flex"
        :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <p
          class="max-w-[85%] rounded-2xl px-3 py-2 whitespace-pre-wrap"
          :class="
            message.role === 'user'
              ? 'bg-accent text-slate-950'
              : 'bg-slate-800 text-gray-100'
          "
        >
          {{ message.content }}
        </p>
      </div>
      <p v-if="isSending" class="text-gray-500">Escribiendo…</p>
      <p v-if="errorText" class="text-red-400">{{ errorText }}</p>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-gray-500">
      <p data-testid="chat-usage">
        <span v-if="limitReached">
          Has alcanzado el límite de {{ MESSAGE_LIMIT }} mensajes. Podrás escribir de nuevo el {{ resetLabel }}.
        </span>
        <span v-else>{{ remaining }} de {{ MESSAGE_LIMIT }} mensajes restantes</span>
      </p>
      <p data-testid="chat-disclaimer" class="text-slate-600">
        Respuestas generadas por IA, pueden contener errores.
      </p>
    </div>
    <div class="flex items-center gap-2 border-t border-slate-800 pt-3">
      <input
        ref="inputEl"
        v-model="inputValue"
        data-testid="chat-input"
        type="text"
        class="flex-1 bg-transparent text-gray-100 outline-none disabled:opacity-50"
        :placeholder="
          unavailable
            ? 'Asistente no disponible'
            : limitReached
              ? 'Límite de mensajes alcanzado'
              : 'Escribe un mensaje…'
        "
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        aria-label="Chat message input"
        :disabled="isSending || limitReached || unavailable"
        @keydown.enter="submit"
      >
      <button
        type="button"
        data-testid="chat-send"
        class="pill hover:border-accent hover:text-accent disabled:opacity-50"
        :disabled="isSending || limitReached || unavailable || !inputValue.trim()"
        @click="submit"
      >
        Enviar
      </button>
    </div>
  </div>
</template>
