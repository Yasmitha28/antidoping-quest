import { useState } from 'react';
import { MessageCircleQuestion, Send, Sparkles, X } from 'lucide-react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

const quickPrompts = [
  'What is anti-doping?',
  'Can I take supplements?',
  'What if I need medication?',
  'What should I do during a test?'
];

function getAssistantReply(question: string): string {
  const lower = question.toLowerCase();

  if (lower.includes('supplement') || lower.includes('supplements')) {
    return 'Before taking any supplement, check the prohibited list, confirm with your medical team, and keep records of what you use.';
  }

  if (lower.includes('medication') || lower.includes('medicine') || lower.includes('doctor') || lower.includes('prescription')) {
    return 'If you need medication, report it to your support staff, keep the prescription and medical documentation, and ask whether it is permitted.';
  }

  if (lower.includes('test') || lower.includes('testing')) {
    return 'During testing, stay calm, cooperate fully, and follow the instructions given by the testing team. If you are unsure, ask for clarification.';
  }

  if (lower.includes('rule') || lower.includes('violation') || lower.includes('mistake')) {
    return 'If you believe a rule may have been missed, report it promptly and seek advice from your support staff before it becomes a bigger issue.';
  }

  if (lower.includes('anti-doping')) {
    return 'Anti-doping means competing fairly, avoiding prohibited substances or methods, and keeping your medical and supplement records transparent.';
  }

  return 'I can help with supplements, medications, testing procedures, and general anti-doping questions. Ask me anything and I will guide you.';
}

export function AntiDopingAgent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Hello! I am your anti-doping guide. Ask me about supplements, medications, testing, or fair play.'
    }
  ]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = { id: Date.now(), role: 'user', text: trimmed };
    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      text: getAssistantReply(trimmed)
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-30">
      {open ? (
        <div className="w-[320px] rounded-3xl border border-brand-500/20 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-brand-500/20 p-2 text-brand-100">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Anti-Doping Agent</p>
                <p className="text-xs text-slate-400">Ask your doubts safely</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full border border-white/10 bg-white/10 p-2 text-slate-200" aria-label="Close assistant">
              <X size={16} />
            </button>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button key={prompt} onClick={() => setInput(prompt)} className="rounded-full border border-brand-500/20 bg-brand-500/10 px-2.5 py-1 text-xs text-brand-100">
                {prompt}
              </button>
            ))}
          </div>

          <div className="mb-3 max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/70 p-2">
            {messages.map((message) => (
              <div key={message.id} className={`rounded-2xl px-3 py-2 text-sm ${message.role === 'assistant' ? 'bg-white/10 text-slate-200' : 'bg-brand-500/20 text-brand-100'}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSend();
              }}
              placeholder="Type your doubt..."
              className="flex-1 rounded-full border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
            />
            <button onClick={handleSend} className="rounded-full bg-brand-500 p-2 text-white" aria-label="Send message">
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-lg">
          <MessageCircleQuestion size={16} />
          Anti-Doping Agent
        </button>
      )}
    </div>
  );
}
