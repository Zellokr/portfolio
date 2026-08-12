import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import ChatApp from '../../app/components/chat/ChatApp.client.vue'

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }))

mockNuxtImport('$fetch', () => fetchMock)

async function typeAndSend(wrapper: VueWrapper, text: string): Promise<void> {
  const input = wrapper.get('[data-testid="chat-input"]')
  await input.setValue(text)
  await input.trigger('keydown.enter')
  await flushPromises()
}

describe('ChatApp.client.vue', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    window.localStorage.clear()
  })

  it('sends the message and renders the assistant reply', async () => {
    fetchMock.mockResolvedValueOnce({ reply: 'Trabajo sobre todo con Vue y Nuxt.' })

    const wrapper = await mountSuspended(ChatApp)
    await typeAndSend(wrapper, '¿Con qué stack trabajas?')

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        body: { messages: [{ role: 'user', content: '¿Con qué stack trabajas?' }] }
      })
    )
    expect(wrapper.text()).toContain('¿Con qué stack trabajas?')
    expect(wrapper.text()).toContain('Trabajo sobre todo con Vue y Nuxt.')
  })

  it('clears the input after sending', async () => {
    fetchMock.mockResolvedValueOnce({ reply: 'Hola.' })

    const wrapper = await mountSuspended(ChatApp)
    await typeAndSend(wrapper, 'Hola')

    const input = wrapper.get<HTMLInputElement>('[data-testid="chat-input"]')
    expect(input.element.value).toBe('')
  })

  it('shows a friendly error message when the request fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network error'))

    const wrapper = await mountSuspended(ChatApp)
    await typeAndSend(wrapper, 'Hola')

    expect(wrapper.text()).toContain('No se pudo enviar el mensaje')
  })

  it('does not send an empty message', async () => {
    const wrapper = await mountSuspended(ChatApp)
    await typeAndSend(wrapper, '   ')

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows the remaining message counter and decrements it after sending', async () => {
    fetchMock.mockResolvedValueOnce({ reply: 'Hola.' })

    const wrapper = await mountSuspended(ChatApp)
    expect(wrapper.get('[data-testid="chat-usage"]').text()).toContain('5 de 5 mensajes restantes')

    await typeAndSend(wrapper, 'Hola')

    expect(wrapper.get('[data-testid="chat-usage"]').text()).toContain('4 de 5 mensajes restantes')
  })

  it('disables the input and stops sending once the limit is reached', async () => {
    fetchMock.mockResolvedValue({ reply: 'Ok.' })

    const wrapper = await mountSuspended(ChatApp)
    for (let i = 0; i < 5; i++) {
      await typeAndSend(wrapper, `Mensaje ${i}`)
    }

    expect(fetchMock).toHaveBeenCalledTimes(5)
    expect(wrapper.get('[data-testid="chat-usage"]').text()).toContain('Has alcanzado el límite de 5 mensajes')
    expect(wrapper.get<HTMLInputElement>('[data-testid="chat-input"]').element.disabled).toBe(true)

    await typeAndSend(wrapper, 'Uno de más')
    expect(fetchMock).toHaveBeenCalledTimes(5)
  })

  it('persists the counter across remounts within the same window', async () => {
    fetchMock.mockResolvedValueOnce({ reply: 'Hola.' })

    const first = await mountSuspended(ChatApp)
    await typeAndSend(first, 'Hola')
    first.unmount()

    const second = await mountSuspended(ChatApp)
    expect(second.get('[data-testid="chat-usage"]').text()).toContain('4 de 5 mensajes restantes')
  })
})
