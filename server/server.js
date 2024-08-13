const express = require('express');
const bodyParser = require('body-parser');
const { NlpManager } = require('node-nlp');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Initialize NLP Manager
const manager = new NlpManager({ languages: ['en'] });

// Train the model
(async () => {
 // Greetings
manager.addDocument('en', 'hello', 'greeting');
manager.addDocument('en', 'hi', 'greeting');
manager.addDocument('en', 'hey', 'greeting');
manager.addDocument('en', 'good morning', 'greeting');
manager.addDocument('en', 'good afternoon', 'greeting');
manager.addDocument('en', 'good evening', 'greeting');
manager.addDocument('en', 'how are you', 'greeting');
manager.addDocument('en', 'what\'s up', 'greeting');

manager.addAnswer('en', 'greeting', 'Hello! How can I help you today?');
manager.addAnswer('en', 'greeting', 'Hi there! What can I do for you?');
manager.addAnswer('en', 'greeting', 'Greetings! How may I assist you?');

// Farewells
manager.addDocument('en', 'bye', 'farewell');
manager.addDocument('en', 'goodbye', 'farewell');
manager.addDocument('en', 'see you later', 'farewell');
manager.addDocument('en', 'have a good day', 'farewell');

manager.addAnswer('en', 'farewell', 'Goodbye! Have a great day!');
manager.addAnswer('en', 'farewell', 'See you later! Take care!');
manager.addAnswer('en', 'farewell', 'Farewell! Don\'t hesitate to come back if you need anything.');

// Thanks
manager.addDocument('en', 'thank you', 'thanks');
manager.addDocument('en', 'thanks', 'thanks');
manager.addDocument('en', 'appreciate it', 'thanks');

manager.addAnswer('en', 'thanks', 'You\'re welcome! Is there anything else I can help with?');
manager.addAnswer('en', 'thanks', 'My pleasure! Let me know if you need further assistance.');

// Help
manager.addDocument('en', 'help', 'help');
manager.addDocument('en', 'I need assistance', 'help');
manager.addDocument('en', 'can you help me', 'help');

manager.addAnswer('en', 'help', 'Of course! I\'m here to help. What do you need assistance with?');
manager.addAnswer('en', 'help', 'I\'d be glad to help. Could you please specify your question or concern?');

// About the chatbot
manager.addDocument('en', 'what are you', 'bot_identity');
manager.addDocument('en', 'are you a bot', 'bot_identity');
manager.addDocument('en', 'are you human', 'bot_identity');

manager.addAnswer('en', 'bot_identity', 'I\'m an AI chatbot designed to assist you with various queries and tasks.');
manager.addAnswer('en', 'bot_identity', 'I\'m a virtual assistant powered by artificial intelligence. How can I help you today?');

// Unable to understand
manager.addDocument('en', 'gibberish', 'not_understood');
manager.addDocument('en', 'blablabla', 'not_understood');

manager.addAnswer('en', 'not_understood', 'I\'m sorry, but I didn\'t understand that. Could you please rephrase or ask a different question?');
manager.addAnswer('en', 'not_understood', 'I\'m having trouble understanding your input. Can you try asking in a different way?');

  await manager.train();
  manager.save();
})();

// API route
app.post('/api/message', async (req, res) => {
  const query = req.body.message;
  const response = await manager.process('en', query);
  res.json({ reply: response.answer });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
