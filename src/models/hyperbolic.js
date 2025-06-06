import { getKey } from '../utils/keys.js';

/**
 * 
 * 
 * Yes, this code was written by an Ai. It was written by GPT-o1 and tested :)
 * 
 */

export class hyperbolic {
    constructor(modelName, apiUrl) {
        this.modelName = modelName || "deepseek-ai/DeepSeek-V3";
        this.apiUrl = apiUrl || "https://api.hyperbolic.xyz/v1/chat/completions";

        // Retrieve the Hyperbolic API key from keys.js
        this.apiKey = getKey('HYPERBOLIC_API_KEY');
        if (!this.apiKey) {
            throw new Error('HYPERBOLIC_API_KEY not found. Check your keys.js file.');
        }
    }

    /**
     * Sends a chat completion request to the Hyperbolic endpoint.
     *
     * @param {Array} turns - An array of message objects, e.g. [{role: 'user', content: 'Hi'}].
     * @param {string} systemMessage - The system prompt or instruction.
     * @param {string} stopSeq - A string that represents a stopping sequence, default '***'.
     * @returns {Promise<string>} - The content of the model's reply.
     */
    async sendRequest(turns, systemMessage, stopSeq = '***') {
        // Prepare the messages with a system prompt at the beginning
        const messages = [{ role: 'system', content: systemMessage }, ...turns];

        // Build the request payload (mirroring your original structure)
        const payload = {
            model: this.modelName,
            messages: messages,
            max_tokens: 8192,
            temperature: 0.7,
            top_p: 0.9,
            stream: false
        };

        let completionContent = null;

        try {
            console.log('Awaiting Hyperbolic API response...');
            console.log('Messages:', messages);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (
                data?.choices?.[0]?.finish_reason &&
                data.choices[0].finish_reason === 'length'
            ) {
                throw new Error('Context length exceeded');
            }

            completionContent = data?.choices?.[0]?.message?.content || '';
            console.log('Received response from Hyperbolic.');

        } catch (err) {
            if (
                (err.message === 'Context length exceeded' ||
                 err.code === 'context_length_exceeded') &&
                turns.length > 1
            ) {
                console.log('Context length exceeded, trying again with a shorter context...');
                // Remove the first user turn and try again (like the original code).
                return await this.sendRequest(turns.slice(1), systemMessage, stopSeq);
            } else {
                console.log(err);
                completionContent = 'My brain disconnected, try again.';
            }
        }

        // Replace any special tokens from your original code if needed
        return completionContent.replace(/<\|separator\|>/g, '*no response*');
    }

    /**
     * Embeddings are not supported in your original snippet, so we mirror that error.
     */
    async embed(text) {
        throw new Error('Embeddings are not supported by Hyperbolic.');
    }
}
