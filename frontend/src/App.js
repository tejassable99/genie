import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getResponse = async () => {
    if (text.trim()) {
      // Update the messages state with the user's message and show the loader
      setMessages([
        ...messages,
        { author: text, bot: null }, // Set bot to null initially
      ]);
      setText('');
      setLoading(true);
      try {
        const response = await fetch(`https://genie-fg2dz.vercel.app/prompt/${text}`);
        const data = await response.json();
        // Update the last message with the bot's response
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].bot = data.candidates?.[0]?.content || 'No response from bot';
          return updatedMessages;
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].bot = 'Error fetching response';
          return updatedMessages;
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default behavior of Enter key
      getResponse();
    }
  };

  return (
    <div className="chat-bot">
      <div className="chat-header">
        <div className="info-container">
          <h3>Chat with Genie</h3>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" fill="#800080">
          <path fillOpacity="1" d="M0,224L60,218.7C120,213,240,203,360,186.7C480,171,600,149,720,154.7C840,160,960,192,1080,186.7C1200,181,1320,139,1380,117.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>
      <div className="feed">
        {messages.map((message, index) => (
          <div key={index}>
            <div className="question bubble">{message.author}</div>
            <div className="response bubble">
              {message.bot === null ? <i className="fas fa-spinner fa-spin"></i> : message.bot}
            </div>
          </div>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..." style={{fontWeight: "bolder", fontSize: "20px"}}
        aria-label="Chat input"
        disabled={loading}
      />
      <button onClick={getResponse} aria-label="Send message" disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          <i className="fas fa-paper-plane"></i>
        )}
      </button>
    </div>
  );
};

export default App;
