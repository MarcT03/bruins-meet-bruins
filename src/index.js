import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import MessageInput from './components/MessageInput';

const Sidebar = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  return (
      <div style={userlistStyle}>
        {Array.from({ length: 30 }).map((_, index) => {
          const isSelected = selectedUser === index;
          return (
            <div
              key={index}
              style={isSelected ? selectedUserStyle : userStyle}
              onClick={() => setSelectedUser(index)}
            >
              User {index + 1}
            </div>
          );
        })}
      </div>
    );
};

const ContentArea = () => {
  const [messages, setMessages] = useState([]);

  const addMessage = (text, isUserMessage) => {
    setMessages([...messages, { text, isUserMessage }]);
  };

  return (
    <div style={contentAreaStyle}>
      <div style={messagelistStyle}>
        {messages.map((message, index) => (
          <div key={index} style={messageStyle(message.isUserMessage)}>
            {message.text}
          </div>
        ))}
      </div>
      <div style={footerStyle}>
        <MessageInput addMessage={addMessage} />
      </div>
    </div>
  );
};

const Container = () => (
  <div style={containerStyle}>
    <Sidebar />
    <ContentArea />
  </div>
);

document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.height = '100%';

const containerStyle = {
  display: 'flex',
  height: '100vh',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const userlistStyle = {
  width: '200px',
  border: '2px solid #ccc',
  backgroundColor: '#ececec',
  overflowY: 'scroll'
};

const userStyle = {
  height: '30',
  padding: '20px',
  border: '0.5px solid #ccc',
}

const selectedUserStyle = {
  height: '30',
  padding: '20px',
  border: '0.5px solid #ccc',
  backgroundColor: 'lightblue'
}

const contentAreaStyle = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const messagelistStyle = {
  padding: '20px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  gap: '10px',
};

const footerStyle = {
  padding: '20px',
  textAlign: 'left',
  backgroundColor: '#ececec',
};

const messageStyle = (isUserMessage) => ({
  padding: '5px 10px',
  backgroundColor: isUserMessage ? '#e6e6e6' : 'lightblue',
  borderRadius: '20px',
  fontSize: '16px',
  display: 'inline-block',
  wordWrap: 'break-word',
  width: 'auto',
  maxWidth: '500px',
  alignSelf: isUserMessage ? 'flex-start' : 'flex-end',
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Container />);
