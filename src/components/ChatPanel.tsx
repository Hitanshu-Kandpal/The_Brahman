import { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import type { GodConfig } from '../App';

interface ChatPanelProps {
  god: GodConfig;
}

interface Message {
  id: number;
  from: 'user' | 'god';
  text: string;
}

export function ChatPanel({ god }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'god',
      text: `I am ${god.name}, ${god.title.toLowerCase()}. This is not a conversation to win, but a mirror to look into.`,
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const userMessage: Message = { id: nextId, from: 'user', text: trimmed };

    const responseText =
      god.id === 'shiva'
        ? 'Notice the part of you that is watching even now. That watcher is older than the question.'
        : god.id === 'vishnu'
        ? 'Every question you ask threads into a larger pattern. What pattern do you sense beneath this one?'
        : 'Language is a river. Let your question dissolve for a moment and feel what remains without words.';

    const godMessage: Message = {
      id: nextId + 1,
      from: 'god',
      text: responseText,
    };

    setMessages((prev) => [...prev, userMessage, godMessage]);
    setInput('');
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="chat-panel container-fluid px-3 px-md-5">
      <div className="chat-header mb-4">
        <Typography variant="overline" className="text-uppercase tracking-wide text-muted">
          Speaking as
        </Typography>
        <Typography variant="h3" className="fw-semibold">
          {god.name}
        </Typography>
        <Typography variant="subtitle1" className="text-muted">
          {god.title}
        </Typography>
      </div>

      <div className="chat-window mb-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message chat-message-${message.from}`}
          >
            <div className="chat-bubble">
              <Typography variant="body1">{message.text}</Typography>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-row d-flex gap-2">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Offer a thought or a question to this aspect of Brahman..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            className: 'chat-input',
          }}
        />
        <Button
          variant="contained"
          color="primary"
          className="chat-send-button"
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
    </section>
  );
}

