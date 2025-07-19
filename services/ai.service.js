const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    async generateResponse(userMessage, conversationHistory = []) {
        try {
            // Build conversation context
            let contextString = '';
            if (conversationHistory.length > 0) {
                contextString = conversationHistory.map(msg => 
                    `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.message_text}`
                ).join('\n') + '\n\n';
            }

            const prompt = `You are a compassionate mental health support AI assistant. 
            Provide helpful, empathetic responses while being careful not to provide medical advice. 
            Always encourage users to seek professional help when appropriate.
            Keep responses concise but supportive.

            ${contextString}User: ${userMessage}
            Assistant:`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            
            return response.text();
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Failed to generate AI response');
        }
    }

    // For streaming responses
    async generateStreamingResponse(userMessage, conversationHistory = []) {
        try {
            let contextString = '';
            if (conversationHistory.length > 0) {
                contextString = conversationHistory.map(msg => 
                    `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.message_text}`
                ).join('\n') + '\n\n';
            }

            const prompt = `You are a compassionate mental health support AI assistant. 
            Provide helpful, empathetic responses while being careful not to provide medical advice. 
            Always encourage users to seek professional help when appropriate.
            Keep responses concise but supportive.

            ${contextString}User: ${userMessage}
            Assistant:`;

            const result = await this.model.generateContentStream(prompt);
            
            return result.stream;
        } catch (error) {
            console.error('AI Streaming Service Error:', error);
            throw new Error('Failed to generate streaming AI response');
        }
    }
}

module.exports = new AIService();