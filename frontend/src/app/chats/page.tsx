"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "../../components/ui/sidebar";
import { FileUpload } from "../../components/ui/file-upload";
import { 
  IconSettings, IconUserBolt, IconMessage, IconPlus, IconSend, 
  IconUser, IconScale, IconAdjustmentsHorizontal, IconReportSearch, 
  IconThumbUp, IconThumbDown, IconBrain, IconQuote, IconCheck
} from "@tabler/icons-react";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import sampleData from '../../../sample.json';

// --- Types ---
type MessageRole = 'user' | 'assistant' | 'supportive' | 'opposing' | 'synthesizer' | 'extractor';

type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
};

type Chat = {
  id: string;
  title: string;
  date: Date;
  preview: string;
};

// --- Sub-Component: The Advarsarial Chat Bubble ---
const AgentMessage = ({ msg }: { msg: Message }) => {
  // Logic: User and Supportive (Optimist) on the Right. Extractor and Opposing (Skeptic) on the Left.
  const isRightAligned = msg.role === 'user' || msg.role === 'supportive';
  const isSynthesizer = msg.role === 'synthesizer';

  const roleStyles: Record<MessageRole, { color: string, icon: any, label: string, border: string, text: string }> = {
    user: { color: "bg-blue-600", text: "text-white", border: "border-transparent", icon: <IconUser size={18}/>, label: "User" },
    supportive: { color: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-slate-900 dark:text-slate-100", border: "border-emerald-200 dark:border-emerald-800", icon: <IconThumbUp size={18} className="text-emerald-600"/>, label: "The Optimist" },
    opposing: { color: "bg-rose-50 dark:bg-rose-950/30", text: "text-slate-900 dark:text-slate-100", border: "border-rose-200 dark:border-rose-800", icon: <IconThumbDown size={18} className="text-rose-600"/>, label: "The Skeptic" },
    extractor: { color: "bg-amber-50 dark:bg-amber-950/30", text: "text-slate-900 dark:text-slate-100", border: "border-amber-200 dark:border-amber-800", icon: <IconReportSearch size={18} className="text-amber-600"/>, label: "Fact Extractor" },
    synthesizer: { color: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-slate-900 dark:text-slate-100", border: "border-indigo-200 dark:border-indigo-800", icon: <IconBrain size={18} className="text-indigo-600"/>, label: "Final Synthesis" },
    assistant: { color: "bg-slate-100 dark:bg-slate-800", text: "text-slate-900 dark:text-slate-100", border: "border-slate-200 dark:border-slate-700", icon: <IconMessage size={18}/>, label: "Assistant" }
  };

  const style = roleStyles[msg.role];

  if (msg.content.startsWith('### ✅')) {
    return (
      <div className="flex items-center justify-center my-8">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-sm">
          <IconCheck size={18} />
          <span className="text-sm font-semibold">Analysis Complete</span>
        </div>
      </div>
    )
  }
  return (
    <div className={cn(
      "flex w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700",
      isRightAligned ? "flex-row-reverse" : "flex-row",
      isSynthesizer && "justify-center"
    )}>
      {/* Avatar Sidebar (Hidden for Synthesizer to center it) */}
      {!isSynthesizer && (
        <div className={cn("flex flex-col items-center shrink-0", isRightAligned ? "ml-4" : "mr-4")}>
          <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shadow-sm border", style.border, msg.role === 'user' ? style.color : "bg-white dark:bg-slate-900")}>
            {style.icon}
          </div>
          <div className="flex-1 w-px bg-slate-200 dark:bg-slate-800 mt-2" />
        </div>
      )}

      {/* Message Bubble */}
      <div className={cn(
        "flex flex-col",
        isRightAligned ? "items-end" : "items-start",
        isSynthesizer ? "max-w-4xl w-full" : "max-w-[75%]"
      )}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 px-1">
          {style.label}
        </span>
        
        <div className={cn(
          "p-6 rounded-[28px] shadow-sm border transition-all",
          style.color, style.border, style.text,
          isRightAligned ? "rounded-tr-none" : "rounded-tl-none",
          isSynthesizer && "rounded-tr-[28px] rounded-tl-[28px] shadow-indigo-500/5 border-2"
        )}>
          <div className={cn("prose prose-sm dark:prose-invert max-w-none", msg.role === 'user' && "text-white prose-headings:text-white")}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function ChatsPage() {
  const [open, setOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChatId]);

  const handleStartAnalysis = (initialText: string, file?: File) => {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      title: initialText.slice(0, 25) || (file ? file.name : "New Analysis"),
      date: new Date(),
      preview: "Analysis in progress..."
    };

    const userMsg: Message = {
      id: 'um-' + Date.now(),
      role: 'user',
      content: `${initialText} ${file ? `\n\n> 📎 **File Attached:** ${file.name}` : ''}`,
      timestamp: new Date()
    };

    setChats([newChat, ...chats]);
    setMessages(prev => ({ ...prev, [newChatId]: [userMsg] }));
    setSelectedChatId(newChatId);

    setTimeout(() => simulateDebate(newChatId), 1000);
  };

  const simulateDebate = (chatId: string) => {
    let messageQueue: Message[] = [];
    
    sampleData.debates.forEach((debate, idx) => {
      messageQueue.push({
        id: `ext-${idx}`,
        role: 'extractor',
        content: `### Factor Identification: ${debate.factor.title}\n${debate.factor.description}\n\n> **Source Quote:** "${debate.factor.source_quote}"`,
        timestamp: new Date()
      });
      messageQueue.push({
        id: `sup-${idx}`,
        role: 'supportive',
        content: `### The Optimist View\n**Summary:** ${debate.supportive.summary}\n\n**Strategic Logic:**\n${debate.supportive.logic}`,
        timestamp: new Date()
      });
      messageQueue.push({
        id: `opp-${idx}`,
        role: 'opposing',
        content: `### The Skeptic View\n**Challenge:** ${debate.opposing.summary}\n\n**Critical Flaws Identifed:**\n${debate.opposing.critiques.map(c => `- **Target:** ${c.target_claim}\n- **Flaw:** ${c.flaw}`).join('\n')}`,
        timestamp: new Date()
      });
      messageQueue.push({
        id: `syn-${idx}`,
        role: 'synthesizer',
        content: `## ⚖️ Deliberation Verdict: ${debate.factor.title}\nAfter weighing the optimistic growth projection against the skeptic's critique of data residency, we conclude: **${debate.opposing.missing_context}**`,
        timestamp: new Date()
      });
    });

    let i = 0;
    const interval = setInterval(() => {
      if (i < messageQueue.length) {
        setMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), messageQueue[i]]
        }));
        i++;
      } else {
        // Add a final completion message
        const completionMessage: Message = {
            id: 'done',
            role: 'synthesizer',
            content: '### ✅ Analysis Complete\nThe deliberative process has concluded.',
            timestamp: new Date()
        };
        setMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), completionMessage]
        }));
        clearInterval(interval);
      }
    }, 2500);
  };

  return (
    <div className="flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 w-full h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">P</div>
              {open && <span className="font-bold text-xl tracking-tight dark:text-white">Prizm</span>}
            </div>
            
            <button 
              onClick={() => setSelectedChatId(null)} 
              className="mt-4 flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900 dark:bg-blue-600 text-white hover:opacity-90 transition-all mx-2"
            >
              <IconPlus size={18} />
              {open && <span className="font-semibold text-sm">New Debate</span>}
            </button>

            <div className="mt-6 space-y-1 px-2 overflow-y-auto no-scrollbar">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl transition-all flex items-center gap-3",
                    selectedChatId === chat.id ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <IconMessage size={16} />
                  {open && <span className="text-sm font-medium truncate">{chat.title}</span>}
                </button>
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 flex flex-col relative bg-white dark:bg-slate-950">
        {selectedChatId ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-10 no-scrollbar">
            <div className="max-w-5xl mx-auto">
              {messages[selectedChatId]?.filter(Boolean).map((msg) => (
                <AgentMessage key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} className="h-20" />
            </div>
          </div>
        ) : (
          <NewChatPlaceholder onStart={handleStartAnalysis} />
        )}

        {selectedChatId && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
            <div className="max-w-3xl mx-auto flex gap-4">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for deeper extraction or challenge the synthesizer..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button className="h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform">
                <IconSend size={20} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Placeholder UI ---
const NewChatPlaceholder = ({ onStart }: { onStart: (t: string, f?: File) => void }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter dark:text-white">
            Prizm <span className="text-blue-600">Deliberation</span>
          </h1>
          <p className="text-slate-500 text-lg">Structured multi-agent adversarial reporting.</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
          <FileUpload onFileSelect={(f) => setFile(f)} selectedFile={file} />
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What should Prizm analyze? (e.g. 'Assess the operational risks in this merger')"
            className="w-full mt-6 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[140px] focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-sm"
          />

          <button
            onClick={() => onStart(text, file || undefined)}
            disabled={!text.trim() && !file}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30"
          >
            <IconBrain size={20} /> Start Analysis
          </button>
        </div>
      </div>
    </div>
  );
};