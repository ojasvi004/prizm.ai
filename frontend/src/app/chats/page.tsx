"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "../../components/ui/sidebar";
import { 
  IconSettings, 
  IconUserBolt,
  IconMessage,
  IconPlus,
  IconSend,
  IconRobot,
  IconUser
} from "@tabler/icons-react";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from "motion/react";

// --- Types ---
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Chat = {
  id: string;
  title: string;
  date: Date;
  preview: string;
};

// --- Mock Data ---
const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    title: 'Project Aether Brainstorming',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    preview: 'Let\'s discuss the architecture for the new backend module...'
  },
  {
    id: '2',
    title: 'React Component Patterns',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    preview: 'What are the best practices for compound components in 2024?'
  },
  {
    id: '3',
    title: 'Database Schema Review',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    preview: 'Checking the foreign key constraints on the user table.'
  }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', role: 'user', content: 'Let\'s discuss the architecture for the new backend module.', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
    { id: 'm2', role: 'assistant', content: 'Sure, I\'d be happy to help. Are we thinking microservices or a modular monolith?', timestamp: new Date(Date.now() - 1000 * 60 * 9) },
    { id: 'm3', role: 'user', content: 'Modular monolith for now. Easier to deploy.', timestamp: new Date(Date.now() - 1000 * 60 * 8) },
  ],
  '2': [
    { id: 'm4', role: 'user', content: 'What are the best practices for compound components in 2024?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: 'm5', role: 'assistant', content: 'In 2024, compound components usually leverage the Context API for state sharing and flexible composition. Would you like an example?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  ],
  '3': [
      { id: 'm6', role: 'user', content: 'Checking the foreign key constraints on the user table.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) },
  ]
};

// --- Components ---

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Prizm AI
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Custom Sidebar item that behaves like a button (for chats)
const ChatMetadataItem = ({
    chat,
    isSelected,
    onClick,
  }: {
    chat: Chat;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    const { open, animate } = useSidebar();
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center justify-start gap-2 group/sidebar py-2 w-full text-left transition-all rounded-md px-2",
          isSelected
            ? "bg-slate-200 dark:bg-slate-700 font-medium text-slate-900 dark:text-white"
            : "text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
        )}
      >
        <IconMessage className={cn("h-5 w-5 flex-shrink-0", isSelected ? "text-blue-600" : "text-slate-500 dark:text-slate-400")} />
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 truncate"
        >
          {chat.title}
        </motion.span>
      </button>
    );
};

export default function ChatsPage() {
  const [open, setOpen] = useState(false);
  
  // Chat Logic State
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChatId) {
      setMessages(MOCK_MESSAGES[selectedChatId] || []);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    let currentChatId = selectedChatId;
    if (!currentChatId) {
        const newChatId = Date.now().toString();
        const newChat: Chat = {
            id: newChatId,
            title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
            date: new Date(),
            preview: input
        };
        setChats([newChat, ...chats]);
        setSelectedChatId(newChatId);
        currentChatId = newChatId;
        MOCK_MESSAGES[newChatId] = [];
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm a static bot for now! You said: "${input}"`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setMessages([]);
    setInput('');
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 w-full flex-1 mx-auto border border-slate-200 dark:border-slate-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-slate-50 dark:bg-slate-900">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
            {open ? <Logo /> : <LogoIcon />}
            
            <div className="mt-8 flex flex-col gap-2">
                {/* New Chat Button using standard SidebarLink style/behavior manually */}
                <button
                    onClick={handleNewChat}
                    className="flex items-center justify-start gap-2 group/sidebar py-2 w-full text-left transition-all rounded-md px-2 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                     <IconPlus className="h-5 w-5 flex-shrink-0 text-slate-700 dark:text-slate-200" />
                     {open && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-pre"
                        >
                            New Chat
                        </motion.span>
                     )}
                </button>

                {/* Divider/Label */}
                {open && chats.length > 0 && (
                    <div className="px-2 pt-4 pb-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Recent
                    </div>
                )}
                
                {chats.map((chat) => (
                    <ChatMetadataItem 
                        key={chat.id}
                        chat={chat}
                        isSelected={selectedChatId === chat.id}
                        onClick={() => setSelectedChatId(chat.id)}
                    />
                ))}
            </div>
          </div>
          
          <div>
            <SidebarLink
              link={{
                label: "Profile",
                href: "#",
                icon: (
                  <IconUserBolt className="h-5 w-5 shrink-0 text-slate-700 dark:text-slate-200" />
                ),
              }}
            />
            <SidebarLink
              link={{
                label: "Settings",
                href: "#",
                icon: (
                  <IconSettings className="h-5 w-5 shrink-0 text-slate-700 dark:text-slate-200" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      
      {/* Dashboard / Chat Area */}
      <ChatInterface 
         selectedChatId={selectedChatId}
         messages={messages}
         input={input}
         setInput={setInput}
         handleSendMessage={handleSendMessage}
         handleKeyDown={handleKeyDown}
         inputRef={inputRef}
         messagesEndRef={messagesEndRef}
      />
    </div>
  );
}

// Separated component for the Chat Area to keep the main file clean and match the "Dashboard" structure
const ChatInterface = ({
    selectedChatId,
    messages,
    input,
    setInput,
    handleSendMessage,
    handleKeyDown,
    inputRef,
    messagesEndRef
}: {
    selectedChatId: string | null;
    messages: Message[];
    input: string;
    setInput: (val: string) => void;
    handleSendMessage: (e?: React.FormEvent) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) => {
    return (
        <div className="flex flex-1">
            <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 relative overflow-hidden">
                
                {/* Chat Header for mobile mainly, or context */}
                {selectedChatId && (
                    <div className="absolute top-0 w-full z-10 px-6 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                           Chat
                        </h2>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth no-scrollbar">
                    {!selectedChatId ? (
                         <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-900">
                                How can I help you today?
                            </h1>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                                {['Explain quantum computing', 'Write a python script', 'Debug React code', 'Creative writing'].map((suggestion, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setInput(suggestion)}
                                        className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 text-sm text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md group bg-white/50 dark:bg-slate-900/50"
                                    >
                                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                                            {suggestion}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-3xl mx-auto space-y-6 pt-10">
                            {messages.map((message) => (
                                <div 
                                    key={message.id} 
                                    className={cn(
                                        "flex gap-4",
                                        message.role === 'user' ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                        message.role === 'assistant' ? "bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700" : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md"
                                    )}>
                                        {message.role === 'assistant' ? <IconRobot className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <IconUser className="w-5 h-5 text-white" />}
                                    </div>
                                    <div className={cn(
                                        "flex flex-col max-w-[80%]",
                                        message.role === 'user' ? "items-end" : "items-start"
                                    )}>
                                        <div className="font-medium text-xs text-slate-400 mb-1 ml-1">
                                            {message.role === 'assistant' ? 'Aether' : 'You'}
                                        </div>
                                        <div className={cn(
                                            "text-sm/6 md:text-base/7 px-4 py-2.5 rounded-2xl shadow-sm",
                                            message.role === 'user' 
                                                ? "bg-gradient-to-r from-blue-600 to-indigo-900 text-white rounded-tr-md" 
                                                : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-md border border-slate-200 dark:border-slate-700"
                                        )}>
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                    <div className="max-w-3xl mx-auto relative">
                        <form 
                            onSubmit={handleSendMessage}
                            className="relative flex items-end w-full p-2 bg-slate-50 dark:bg-slate-900 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all border border-transparent focus-within:border-blue-500/50"
                        >
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message Aether..."
                                rows={1}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base resize-none max-h-[200px] py-3 px-3 no-scrollbar outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                                style={{ minHeight: '48px' }}
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "p-2 rounded-lg transition-all duration-200 mb-1 mr-1",
                                    input.trim() 
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-900 text-white hover:opacity-90 shadow-sm" 
                                        : "bg-transparent text-slate-400 cursor-not-allowed hover:bg-slate-200/50 dark:hover:bg-slate-800/50" 
                                )}
                            >
                                <IconSend className="w-5 h-5" />
                            </button>
                        </form>
                        <div className="text-center mt-3">
                            <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500">
                                AI can make mistakes. Please verify important information.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};