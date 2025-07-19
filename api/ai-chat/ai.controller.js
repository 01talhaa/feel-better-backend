const AiChat = require('./ai.model');
const AIService = require('../../services/ai.service');

exports.startNewSession = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "userId is required to start a session." });
        }
        const session = await AiChat.createSession(userId);
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: "Error starting AI session", error: error.message });
    }
};

exports.getSessionMessages = async (req, res) => {
    try {
        const messages = await AiChat.findMessagesBySession(req.params.sessionId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching session messages", error: error.message });
    }
};

exports.postMessageToSession = async (req, res) => {
    const { sessionId } = req.params;
    const { userId, messageText } = req.body;

    try {
        // 1. Get conversation history for context
        const conversationHistory = await AiChat.findMessagesBySession(sessionId);

        // 2. Save the user's message
        const userMessage = {
            session_id: sessionId,
            sender: 'user',
            message_text: messageText
        };
        await AiChat.addMessage(userMessage);

        // 3. Generate AI response using Gemini
        const aiResponseText = await AIService.generateResponse(messageText, conversationHistory);

        // 4. Save the AI's message
        const aiMessage = {
            session_id: sessionId,
            sender: 'ai',
            message_text: aiResponseText
        };
        const savedAiMessage = await AiChat.addMessage(aiMessage);

        // 5. Return the AI's response to the client
        res.status(201).json(savedAiMessage);

    } catch (error) {
        console.error('Error in AI chat:', error);
        
        // Fallback response if AI fails
        const fallbackMessage = {
            session_id: sessionId,
            sender: 'ai',
            message_text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment, or consider reaching out to a mental health professional if you need immediate support."
        };
        const savedFallback = await AiChat.addMessage(fallbackMessage);
        
        res.status(201).json(savedFallback);
    }
};

// Optional: Add streaming endpoint
exports.postStreamingMessageToSession = async (req, res) => {
    const { sessionId } = req.params;
    const { messageText } = req.body;

    try {
        // Set headers for streaming
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        const conversationHistory = await AiChat.findMessagesBySession(sessionId);
        
        // Save user message
        await AiChat.addMessage({
            session_id: sessionId,
            sender: 'user',
            message_text: messageText
        });

        // Get streaming response
        const stream = await AIService.generateStreamingResponse(messageText, conversationHistory);
        
        let fullResponse = '';
        
        // Stream the response
        for await (const chunk of stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            res.write(chunkText);
        }
        
        // Save complete AI response
        await AiChat.addMessage({
            session_id: sessionId,
            sender: 'ai',
            message_text: fullResponse
        });
        
        res.end();
    } catch (error) {
        console.error('Streaming error:', error);
        res.status(500).json({ message: "Error in streaming response", error: error.message });
    }
};