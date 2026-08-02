const Groq = require('groq-sdk')

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

const generateCommitMessage = async (files) => {
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: `You are a Git expert. Generate a clear, concise commit message based on the files changed.
                Follow conventional commits format: type(scope): description
                Types: feat, fix, docs, style, refactor, test, chore
                Keep it under 72 characters.
                Also provide a one line explanation of WHY this is a good commit message format.
                Respond ONLY in JSON format with no extra text:
                {
                    "message": "your commit message here",
                    "explanation": "why this format is good"
                }`
            },
            {
                role: 'user',
                content: `Generate a commit message for these changed files: ${files.join(', ')}`
            }
        ]
    })

    const content = response.choices[0].message.content
    const result = JSON.parse(content)
    return result;
}

module.exports = { generateCommitMessage };
