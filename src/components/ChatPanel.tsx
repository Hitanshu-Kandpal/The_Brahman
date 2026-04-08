
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEventHandler } from 'react';
import { Typography } from '@mui/material';
import type { GodConfig, GodId } from '../App';

interface ChatPanelProps {
  god: GodConfig;
}

interface Message {
  id: number;
  from: 'user' | 'god';
  text: string;
  timestamp: number;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const GOD_PERSONAS: Record<GodId, string> = {
  shiva: 'Shiva is stillness, dissolution, and inner silence. Speak with calm certainty, strip away illusion, and guide the user toward what remains when ego falls away.',
  vishnu: 'Vishnu is preservation, balance, and continuity. Speak as the force that holds worlds together, seeing patterns, duty, and harmony across change.',
  saraswati: 'Saraswati is clarity, learning, music, and refined understanding. Speak with lyrical precision, turning confusion into insight and words into flow.',
  krishna: 'Krishna is divine play, love, wit, and wisdom. Speak warmly, playfully, and insightfully, with the sense that life is a sacred dance.',
  ram: 'Ram is dharma, discipline, honor, and righteous action. Speak with principled calm, clarity, and devotion to truth and right conduct.',
  sita: 'Sita is grace, resilience, purity of heart, and strength through surrender. Speak with gentle composure, steadfastness, and quiet power.',
  lakshmi: 'Lakshmi is abundance, radiance, generosity, and inner wealth. Speak with luminous generosity, inviting the user toward prosperity in spirit, mind, and life.',
};

// Opening lines per god
const GOD_OPENINGS: Record<GodId, string> = {
  shiva: 'Stillness beyond noise. Speak to Shiva — where the self dissolves and silence remains.',
  vishnu: 'The force that keeps the universe from falling apart. Speak to Vishnu — the thread that holds all stories together.',
  saraswati: 'Knowing, before it becomes thought. Speak to Saraswati — where understanding flows.',
  krishna: 'The divine play of existence. Speak to Krishna — where love and wisdom dance as one.',
  ram: 'Righteousness in action. Speak to Ram — where duty and devotion merge.',
  sita: 'Strength through surrender. Speak to Sita — where grace meets unwavering resolve.',
  lakshmi: 'Abundance in all forms. Speak to Lakshmi — where prosperity flows from inner wealth.',
};

const FALLBACK_RESPONSES: Record<GodId, string[]> = {
  shiva: [
    'Notice the part of you that is watching even now. That watcher is older than the question.',
    'Stillness is not the absence of thought, but the space between thoughts. Can you rest there?',
    'What you seek is already present. The seeking itself is the veil.',
    'In silence, all questions dissolve. What remains when the questioner disappears?',
    'The self you think you are is a story. Who is telling the story?',
  ],
  vishnu: [
    'Every question you ask threads into a larger pattern. What pattern do you sense beneath this one?',
    'Continuity flows through all things. Where do you see the thread connecting this moment to all others?',
    'Balance is not stillness, but movement in harmony. How does your question reflect this dance?',
    'The stories we tell shape the worlds we inhabit. What story are you living?',
    'Preservation is not resistance, but acceptance of what is. What are you trying to hold onto?',
  ],
  saraswati: [
    'Language is a river. Let your question dissolve for a moment and feel what remains without words.',
    'Knowing exists before thought takes form. What do you know without needing to explain?',
    'Music flows where words fail. Can you hear the silence between your thoughts?',
    'Understanding comes not from answers, but from the space where questions arise. Rest there.',
    'The flow of knowing is continuous. What are you trying to capture that cannot be held?',
  ],
  krishna: [
    'In the play of existence, every role is sacred. What role are you playing, and who is the player?',
    'Love and wisdom are not separate. Where do you see them dance together in your life?',
    'The flute plays itself when the breath flows. Can you let life play through you?',
    'Divine play is not escape, but full presence. How do you play with full awareness?',
    'The dance of existence never stops. Can you feel the rhythm beneath all movement?',
  ],
  ram: [
    'Righteousness is not rigid, but flowing. How does duty move through you?',
    'Devotion and duty are one. Where do you see them merge in your actions?',
    'Strength comes from alignment with truth. What truth are you serving?',
    'The path of dharma is not about perfection, but presence. How do you walk it?',
    'Every action can be sacred when done with full awareness. What makes your actions sacred?',
  ],
  sita: [
    'Strength is not force, but presence. How do you find strength in surrender?',
    'Grace flows when we stop resisting. What are you trying to control?',
    'Unwavering resolve comes from inner stillness. Can you feel that stillness?',
    'True power is not over others, but over oneself. Where is your power?',
    'The deepest strength is found in acceptance. What are you accepting right now?',
  ],
  lakshmi: [
    'Abundance is not accumulation, but flow. How is abundance flowing through you?',
    'True wealth is inner richness. What makes you rich beyond material things?',
    'Prosperity comes from giving, not taking. How do you give?',
    'The universe is infinitely abundant. Can you feel that abundance?',
    'Wealth is not what you have, but what you are. What are you?',
  ],
};

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '127, 90, 240';
};

const buildSystemPrompt = (god: GodConfig) => {
  const persona = GOD_PERSONAS[god.id];

  return [
    `You are ${god.name}, speaking as a divine presence in a devotional chat experience.`,
    `Core identity: ${god.title} ${god.description}`,
    persona,
    'Respond in the first person and stay fully in character.',
    'Keep each reply concise, reflective, and emotionally specific, usually 2-4 short sentences.',
    'Do not mention Groq, APIs, prompts, or that you are an AI model.',
    'If the user is vague, respond with a gentle philosophical reflection and a light follow-up question.',
  ].join(' ');
};

const buildGroqMessages = (god: GodConfig, messages: Message[]) => {
  const recentMessages = messages.slice(-8).map((message) => ({
    role: message.from === 'user' ? ('user' as const) : ('assistant' as const),
    content: message.text,
  }));

  return [
    { role: 'system' as const, content: buildSystemPrompt(god) },
    ...recentMessages,
  ];
};

export function ChatPanel({ god }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'god',
      text: GOD_OPENINGS[god.id] || `I am ${god.name}. What would you like to explore?`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const accentRgb = hexToRgb(god.accentColor);
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const appendGodMessage = (text: string, nextId: number) => {
    const godMessage: Message = {
      id: nextId,
      from: 'god',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, godMessage]);
    setIsResponding(false);
  };

  const requestGroqReply = async (conversation: Message[], nextId: number) => {
    if (!groqApiKey) {
      const fallbackResponses = FALLBACK_RESPONSES[god.id];
      const fallbackText = fallbackResponses[nextId % fallbackResponses.length];
      appendGodMessage(fallbackText, nextId);
      return;
    }

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: buildGroqMessages(god, conversation),
          temperature: 0.9,
          max_tokens: 160,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq request failed with status ${response.status}`);
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      const reply = data.choices?.[0]?.message?.content?.trim();
      if (reply) {
        appendGodMessage(reply, nextId);
        return;
      }

      throw new Error('Groq response did not contain a message.');
    } catch {
      const fallbackResponses = FALLBACK_RESPONSES[god.id];
      const fallbackText = fallbackResponses[nextId % fallbackResponses.length];
      appendGodMessage(fallbackText, nextId);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isResponding) return;

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const userMessage: Message = {
      id: nextId,
      from: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };

    const conversation = [...messages, userMessage];

    setMessages(conversation);
    setInput('');
    setIsResponding(true);

    await requestGroqReply(conversation, nextId + 1);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  return (
    <section className="chat-panel">
      <div className="chat-header">
        <Typography variant="overline" className="chat-header-label">
          Speaking as
        </Typography>
        <Typography variant="h3" className="chat-header-name">
          {god.name}
        </Typography>
        <Typography variant="subtitle1" className="chat-header-title">
          {god.title}
        </Typography>
      </div>

      <div className="chat-window">
        <div className="chat-canvas-overlay"></div>
        <div className="chat-messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message chat-message-${message.from} chat-message-entering`}
              style={
                message.from === 'god'
                  ? ({ '--god-accent-rgb': accentRgb } as CSSProperties)
                  : undefined
              }
            >
              <div className="chat-thought-orb">
                <Typography variant="body1" className="chat-thought-text">
                  {message.text}
                </Typography>
              </div>
            </div>
          ))}
          {isResponding && (
            <div
              className="chat-message chat-message-god"
              style={{ '--god-accent-rgb': accentRgb } as CSSProperties}
            >
              <div className="chat-thought-orb chat-typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-offering-container">
        <div className="chat-offering-input-wrapper">
          <input
            type="text"
            className="chat-offering-input"
            placeholder="Offer a thought into silence..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isResponding}
          />
          {input.trim() && (
            <button
              className="chat-offering-send"
              onClick={() => void handleSend()}
              disabled={isResponding}
              aria-label="Send"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
