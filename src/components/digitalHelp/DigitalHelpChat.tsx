import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Users, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Copy, 
  HelpCircle, 
  Bot, 
  User, 
  Lightbulb,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { DigitalHelpMessage } from '../../types';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface DigitalHelpChatProps {
  onAskFamily: (question: string) => void;
  initialQuery?: string | null;
}

const SAMPLE_QUESTIONS = [
  'How do I make the writing bigger on my phone?',
  'How do I video call my grandchild on WhatsApp?',
  'How do I connect my iPad to my home Wi-Fi?',
  'How do I silence my phone at night so it does not ring?',
  'How do I take a screenshot of a message?',
];

export const DigitalHelpChat: React.FC<DigitalHelpChatProps> = ({ onAskFamily, initialQuery }) => {
  const [messages, setMessages] = useState<DigitalHelpMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'assistant',
      text: "Hello! I am your friendly digital assistant. Ask me anything about your phone, tablet, computer, smart TV, or apps like WhatsApp and NHS. There are no silly questions!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      steps: [
        {
          title: 'Tip: You can speak or type',
          description: 'Tap the blue microphone button below to speak out loud, or type in the box.',
        },
        {
          title: 'Tip: Tap the speaker icon anytime',
          description: 'I can read any answer out loud to you in clear British English.',
        },
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeVoiceMessageId, setActiveVoiceMessageId] = useState<string | null>(null);

  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle initialQuery if passed from other modules (e.g. Subscription Manager cancellation help)
  const initialQueryTriggered = useRef(false);
  useEffect(() => {
    if (initialQuery && !initialQueryTriggered.current) {
      initialQueryTriggered.current = true;
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-GB';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join('');
          setInputQuery(transcript);
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      alert('Voice input is not supported in this browser. Please use the text box.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    // Stop speech recognition if active
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    stopSpeaking();

    const userMessageId = `user_${Date.now()}`;
    const newUserMessage: DigitalHelpMessage = {
      id: userMessageId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Call backend API /api/digital-help
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/digital-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await res.json();
      const assistantMessageId = `asst_${Date.now()}`;

      const newAssistantMessage: DigitalHelpMessage = {
        id: assistantMessageId,
        sender: 'assistant',
        text: data.text || 'Here are the simple steps to help you:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        steps: data.steps || [],
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (err: any) {
      console.error('Error fetching digital help:', err);
      const fallbackId = `err_${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: fallbackId,
          sender: 'assistant',
          text: "I am having a small hiccup reaching the guidance assistant right now. You can try asking again, or tap the button below to ask your family member instead.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadAloudMessage = (msg: DigitalHelpMessage) => {
    if (isSpeaking && activeVoiceMessageId === msg.id) {
      stopSpeaking();
      setActiveVoiceMessageId(null);
      return;
    }

    let fullSpeech = msg.text;
    if (msg.steps && msg.steps.length > 0) {
      const stepsSpeech = msg.steps
        .map((s, i) => `Step ${i + 1}: ${s.title}. ${s.description}`)
        .join('. ');
      fullSpeech += `. ${stepsSpeech}`;
    }

    setActiveVoiceMessageId(msg.id);
    speakText(fullSpeech);
  };

  const handleCopy = (msg: DigitalHelpMessage) => {
    let copyText = msg.text;
    if (msg.steps && msg.steps.length > 0) {
      copyText += '\n\n' + msg.steps.map((s, i) => `${i + 1}. ${s.title}\n${s.description}`).join('\n\n');
    }
    navigator.clipboard.writeText(copyText);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'welcome_msg',
        sender: 'assistant',
        text: "Hello again! What can I help you with today? Feel free to ask about any phone, tablet, or app feature.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Get the most recent user query if they want to ask family about it
  const lastUserQuestion = [...messages].reverse().find((m) => m.sender === 'user')?.text || inputQuery;

  return (
    <div id="digital-help-chat-container" className="bg-white rounded-3xl border-2 border-slate-200 shadow-md overflow-hidden flex flex-col">
      {/* Chat Top Banner */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white">
              Patient Tech Mentor Chat
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Clear, step-by-step answers in plain English. No jargon.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="chat-reset-btn"
            onClick={handleResetChat}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span className="text-xs sm:text-sm font-bold text-slate-700">
            Popular questions seniors ask:
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-teal-50 border border-slate-300 hover:border-teal-400 text-slate-700 text-xs sm:text-sm font-medium whitespace-nowrap transition-all shadow-2xs hover:text-teal-900"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[520px] min-h-[380px] bg-slate-50/40">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              id={`chat-msg-${msg.id}`}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 sm:p-6 shadow-xs space-y-3 ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-white text-slate-900 border-2 border-slate-200/90 rounded-tl-xs'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className={`font-bold ${isUser ? 'text-slate-300' : 'text-teal-800'}`}>
                    {isUser ? 'You' : 'Digital Help Assistant'}
                  </span>
                  <span className={isUser ? 'text-slate-400' : 'text-slate-400'}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Message Text */}
                <div className={`text-base sm:text-lg leading-relaxed font-normal ${isUser ? 'text-white' : 'text-slate-800'}`}>
                  {msg.text}
                </div>

                {/* Structured Steps if present */}
                {msg.steps && msg.steps.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {msg.steps.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-teal-50/60 rounded-2xl p-4 border border-teal-100/90 space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {sIdx + 1}
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-teal-950">
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed pl-8">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Assistant Actions Toolbar */}
                {!isUser && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReadAloudMessage(msg)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          isSpeaking && activeVoiceMessageId === msg.id
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSpeaking && activeVoiceMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                            <span>Stop Reading</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                            <span>Read Out Loud</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-600" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => onAskFamily(lastUserQuestion || msg.text)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold border border-amber-300/80 transition-all"
                    >
                      <Users className="w-3.5 h-3.5 text-amber-800" />
                      <span>Ask a family member</span>
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-4 justify-start animate-fadeIn">
            <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-sm font-semibold text-slate-600">
                Finding simple, numbered steps for you...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Listening Active Banner */}
      {isListening && (
        <div className="bg-rose-50 border-t-2 border-rose-300 px-6 py-2.5 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            <span className="text-sm font-bold text-rose-900">
              Listening to you speak... Say your question clearly.
            </span>
          </div>
          <button
            onClick={toggleVoiceInput}
            className="text-xs font-bold text-rose-800 underline hover:text-rose-950"
          >
            Done speaking
          </button>
        </div>
      )}

      {/* Input Bar & Actions */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Voice Input Button */}
          <button
            id="chat-mic-btn"
            type="button"
            onClick={toggleVoiceInput}
            className={`p-3.5 sm:p-4 rounded-2xl transition-all shadow-sm shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-200'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
            }`}
            title={isListening ? 'Stop listening' : 'Speak your question out loud'}
            aria-label="Voice input"
          >
            {isListening ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6 text-teal-700" />
            )}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              id="digital-help-question-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything (e.g. 'How do I send a photo?')..."
              className="w-full pl-5 pr-12 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base sm:text-lg focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
            />
          </div>

          {/* Send Button */}
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3.5 sm:p-4 rounded-2xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="Send question"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>

        {/* Family Escalation Quick Action */}
        <div className="flex items-center justify-between pt-1 text-xs sm:text-sm text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Bot className="w-4 h-4 text-teal-700" />
            Patient AI guidance powered by Gemini
          </span>

          <button
            id="ask-family-direct-btn"
            onClick={() => onAskFamily(lastUserQuestion || 'I need some help with my device')}
            className="font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Ask a family member instead</span>
          </button>
        </div>
      </div>
    </div>
  );
};
