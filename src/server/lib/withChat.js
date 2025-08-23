import { secrets } from '../../helper/secrets-loader.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function withChat(App) {
  App.chat = {
    complete: async (messages) => {
      const str = JSON.stringify(messages)
      if (str.length > 4000) {
        throw new Error('HTW-Chat: Messages too long')
      }
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secrets('config_openrouter_api_key')}`,
          },
          body: JSON.stringify({
            model: 'mistralai/mistral-small-3.2-24b-instruct',
            provider: { only: ['Mistral'] },
            messages,
            max_tokens: 300,
          }),
        }
      )
      /** @type {any} */
      const data = await response.json()
      // make sure response is available and from role assistant
      if (
        data &&
        data.choices &&
        data.choices.length > 0 &&
        data.choices[0].message &&
        data.choices[0].message.role === 'assistant'
      ) {
        return data.choices[0].message.content
      }
      throw new Error('HTW-Chat: Invalid response from OpenRouter')
    },
  }
}
