const express = require('express');
const bodyParser = require('body-parser');
const { NlpManager } = require('node-nlp');

const app = express();
app.use(bodyParser.json());

// Initialize NLP Manager
const manager = new NlpManager({ languages: ['en'] });

// Train the model
(async () => {
  manager.addDocument('en', 'hello', 'greeting');
  manager.addDocument('en', 'hi', 'greeting');
  manager.addDocument('en', 'how are you', 'greeting');
  manager.addAnswer('en', 'greeting', 'Hello! How can I help you today?');

  await manager.train();
  manager.save();
})();

app.post('/api/message', async (req, res) => {
  const query = req.body.message;
  const response = await manager.process('en', query);
  res.json({ reply: response.answer });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
