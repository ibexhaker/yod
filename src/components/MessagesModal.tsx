import React, { useState } from 'react';
import { X, Send, ChevronLeft, Search, CheckCheck } from 'lucide-react';
import { Conversation } from '../types';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onSendMessage: (convId: string, text: string) => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  isOpen,
  onClose,
  conversations,
  onSendMessage,
}) => {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConvId) return;
    onSendMessage(activeConvId, messageInput.trim());
    setMessageInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-md h-[600px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50/70">
          {activeConv ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveConvId(null)}
                className="p-1 -ml-1 text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <img
                src={activeConv.userImg}
                alt=""
                className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-200"
              />
              <div>
                <div className="text-xs font-bold text-neutral-900">{activeConv.fullName}</div>
                <div className="text-[10px] text-green-600 font-medium">Active now</div>
              </div>
            </div>
          ) : (
            <div className="text-sm font-bold text-neutral-900">Direct Messages</div>
          )}

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Conversation List or Active Chat */}
        {!activeConv ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search Bar */}
            <div className="p-3 border-b border-neutral-100">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search messages or friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 text-xs rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-rose-400"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-50">
              {conversations
                .filter((c) => c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || c.username.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className="w-full p-3.5 flex items-center gap-3 hover:bg-neutral-50 text-left transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={conv.userImg}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover ring-1 ring-neutral-200"
                      />
                      {conv.unread && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-neutral-900 truncate">
                          {conv.fullName}
                        </span>
                        <span className="text-[10px] text-neutral-400">{conv.timeAgo}</span>
                      </div>
                      <p className={`text-xs truncate ${conv.unread ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 bg-neutral-50/40">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {activeConv.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs ${
                      m.sender === 'user'
                        ? 'bg-rose-500 text-white rounded-br-xs'
                        : 'bg-neutral-200/80 text-neutral-900 rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-neutral-400 mt-0.5 px-1">
                    <span>{m.timestamp}</span>
                    {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-rose-500" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat composer */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-neutral-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 text-xs bg-neutral-100 focus:bg-white border border-neutral-200 rounded-full px-4 py-2 outline-none focus:border-rose-400"
                autoFocus
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2 text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-40 rounded-full transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
