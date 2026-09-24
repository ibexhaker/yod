import React, { useState, useRef, useEffect } from 'react';
import { Conversation, DirectMessage, ReelItem, UserProfile } from '../types';
import {
  Send,
  ArrowLeft,
  CheckCheck,
  Sparkles,
  MessageCircle,
  UserPlus,
  Users,
  Search,
  Check,
  Clapperboard,
  Play,
  X,
  ExternalLink,
  Smile,
  Circle,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface DirectMessagesDrawerProps {
  conversations: Conversation[];
  availableReels?: ReelItem[];
  allCurators?: UserProfile[];
  friends?: string[];
  onSendMessage: (convId: string, text: string, sharedReel?: ReelItem) => void;
  onAddFriend?: (username: string) => void;
  onOpenReel?: (reel: ReelItem) => void;
  onSelectUserPosts?: (username: string) => void;
}

export const DirectMessagesDrawer: React.FC<DirectMessagesDrawerProps> = ({
  conversations,
  availableReels = [],
  allCurators = [],
  friends = [],
  onSendMessage,
  onAddFriend,
  onOpenReel,
  onSelectUserPosts,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'friends'>('all');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [showReelPickerModal, setShowReelPickerModal] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const filteredConversations = filterMode === 'friends'
    ? conversations.filter((c) => c.isFriend || friends.includes(c.username))
    : conversations;

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSelectConversation = (convId: string) => {
    sound.playPop();
    setSelectedConvId(convId);
    setMobileView('chat');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;
    const textToSend = messageInput.trim();
    setMessageInput('');
    sound.playPop();

    onSendMessage(activeConv.id, textToSend);
  };

  const handleSendSharedReel = (reel: ReelItem) => {
    if (!activeConv) return;
    sound.playCameraShutter();
    const note = messageInput.trim() || `Check out this Short from @${reel.username}!`;
    onSendMessage(activeConv.id, note, reel);
    setShowReelPickerModal(false);
    setMessageInput('');
  };

  const handleAddNewFriendChat = (curator: UserProfile) => {
    sound.playLikeChime();
    onAddFriend?.(curator.username);
    setShowAddFriendModal(false);

    const existing = conversations.find((c) => c.username === curator.username);
    if (existing) {
      setSelectedConvId(existing.id);
      setMobileView('chat');
    }
  };

  return (
    <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 h-[calc(100vh-160px)] min-h-[520px] flex overflow-hidden shadow-sm rounded-2xl relative">
      {/* Left conversation & friend list */}
      <div
        className={`${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 border-r border-[#1A1A1A]/10 bg-white flex-col shrink-0 transition-all`}
      >
        <div className="p-4 border-b border-[#1A1A1A]/10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-serif-editorial font-light text-[#1A1A1A]">
                Curator <span className="italic opacity-70">Letters</span>
              </h3>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#1A1A1A]/50">
                Chat & share shorts with friends
              </p>
            </div>

            {/* Add Friend Button */}
            <button
              onClick={() => {
                sound.playPop();
                setShowAddFriendModal(true);
              }}
              className="bg-black text-white hover:bg-neutral-800 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 transition-transform active:scale-95 text-xs font-sans font-bold"
              title="Add people as friends to chat"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </button>
          </div>

          {/* Filter Tabs: All vs Friends */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`flex-1 py-1.5 text-[10px] font-sans uppercase tracking-wider font-bold rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Letters ({conversations.length})
            </button>
            <button
              onClick={() => setFilterMode('friends')}
              className={`flex-1 py-1.5 text-[10px] font-sans uppercase tracking-wider font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                filterMode === 'friends'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>
                Friends (
                {
                  conversations.filter(
                    (c) => c.isFriend || friends.includes(c.username)
                  ).length
                }
                )
              </span>
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#1A1A1A]/5">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">
              <Users className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="font-serif-editorial italic text-sm text-neutral-600">
                No friends added yet.
              </p>
              <button
                onClick={() => setShowAddFriendModal(true)}
                className="mt-3 text-xs font-sans uppercase tracking-wider font-bold bg-black text-white px-4 py-2 rounded-full inline-block"
              >
                + Add Curators to Chat
              </button>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isFriend = conv.isFriend || friends.includes(conv.username);
              const isSelected = selectedConvId === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#F5F5F5] border-l-4 border-[#1A1A1A]'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.userImg}
                      alt={conv.username}
                      className="w-11 h-11 rounded-full object-cover border border-[#1A1A1A]/10 shadow-sm"
                    />
                    {/* Online status indicator */}
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0 shadow" />
                    {conv.unread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ed4956] absolute -top-0.5 -right-0.5 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <h4 className="font-sans text-xs font-bold text-[#1A1A1A] truncate">
                          {conv.fullName || conv.username}
                        </h4>
                        {isFriend && (
                          <span className="text-[9px] font-sans font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full uppercase">
                            Friend
                          </span>
                        )}
                      </div>
                      <span className="font-sans text-[9px] text-[#1A1A1A]/40 uppercase tracking-wider shrink-0 ml-1">
                        {conv.timeAgo}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#1A1A1A]/60 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right chat message thread (Visible on mobile when in 'chat' view, always on md) */}
      <div
        className={`${
          mobileView === 'chat' ? 'flex' : 'hidden md:flex'
        } flex-1 flex-col justify-between bg-[#FDFCFB] h-full`}
      >
        {activeConv ? (
          <>
            {/* Chat header */}
            <div className="p-3.5 md:p-4 border-b border-[#1A1A1A]/10 bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                <button
                  onClick={() => {
                    sound.playPop();
                    setMobileView('list');
                  }}
                  className="md:hidden p-1.5 rounded-full hover:bg-neutral-100 text-black mr-1"
                  title="Back to conversation list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <img
                    src={activeConv.userImg}
                    alt={activeConv.username}
                    className="w-10 h-10 rounded-full object-cover border border-[#1A1A1A]/10 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onSelectUserPosts?.(activeConv.username)}
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className="font-sans text-xs md:text-sm font-bold text-[#1A1A1A] cursor-pointer hover:underline"
                      onClick={() => onSelectUserPosts?.(activeConv.username)}
                    >
                      {activeConv.fullName}
                    </h4>
                    {(activeConv.isFriend || friends.includes(activeConv.username)) && (
                      <span className="text-[9px] font-sans font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                        Friend
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 font-sans text-[10px] text-[#1A1A1A]/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Active Now</span>
                    <span>•</span>
                    <span className="font-mono">@{activeConv.username}</span>
                  </div>
                </div>
              </div>

              {/* View their publications / posts button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectUserPosts?.(activeConv.username)}
                  className="text-xs font-sans font-bold uppercase tracking-wider text-black border border-black/20 hover:border-black bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  title="View their published monographs"
                >
                  <span>Watch Posts</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Shared Short / Reel Card inside chat */}
                  {msg.sharedReel && (
                    <div
                      onClick={() => onOpenReel?.(msg.sharedReel!)}
                      className="mb-2 max-w-xs md:max-w-sm bg-black text-white rounded-2xl overflow-hidden shadow-xl border border-white/20 cursor-pointer group hover:scale-[1.02] transition-transform"
                    >
                      <div className="relative aspect-[4/5] max-h-56 bg-neutral-900 overflow-hidden">
                        <img
                          src={msg.sharedReel.videoPoster}
                          alt={msg.sharedReel.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-white text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[9px] font-sans font-bold uppercase tracking-wider text-white flex items-center gap-1">
                          <Clapperboard className="w-3 h-3 text-rose-400" />
                          <span>Short / Reel</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={msg.sharedReel.userImg}
                            alt=""
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="font-sans font-bold text-xs">
                            @{msg.sharedReel.username}
                          </span>
                        </div>
                        <p className="font-serif-editorial text-xs text-neutral-300 line-clamp-1">
                          {msg.sharedReel.caption}
                        </p>
                        <span className="text-[10px] text-rose-300 font-sans font-bold block mt-1">
                          ▶ Tap to Watch Short
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Text bubble with quick reaction pill */}
                  {msg.text && (
                    <div
                      className={`max-w-xs md:max-w-md p-3.5 rounded-2xl text-xs font-sans leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#1A1A1A] text-white rounded-tr-none'
                          : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  <span className="text-[9px] font-sans text-[#1A1A1A]/40 mt-1 uppercase tracking-wider">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Send input with "Send Short" button */}
            <form
              onSubmit={handleSend}
              className="p-3 md:p-4 bg-white border-t border-[#1A1A1A]/10 flex items-center gap-2"
            >
              {/* Button to attach/send a Short into chat */}
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setShowReelPickerModal(true);
                }}
                className="p-2.5 rounded-xl border border-black/15 bg-neutral-100 hover:bg-neutral-200 text-black transition-colors flex items-center gap-1.5 shrink-0"
                title="Send a Short / Snap to friend in chat"
              >
                <Clapperboard className="w-4 h-4 text-rose-600" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                  Shorts
                </span>
              </button>

              <input
                type="text"
                placeholder={`Message @${activeConv.username}...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-xl px-4 py-2.5 text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="bg-[#1A1A1A] text-white px-4 md:px-5 py-2.5 rounded-xl text-xs font-sans uppercase tracking-widest font-bold disabled:opacity-40 hover:bg-black transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageCircle className="w-12 h-12 text-[#1A1A1A]/20 mb-3" />
            <p className="font-serif-editorial text-lg italic text-[#1A1A1A]/60">
              Select a friend from the list to start chatting
            </p>
          </div>
        )}
      </div>

      {/* MODAL 1: Add People as Friends Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] text-[#1A1A1A] w-full max-w-md rounded-2xl p-6 border border-[#1A1A1A]/15 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
              <div>
                <h3 className="font-serif-editorial text-xl font-light">
                  Add People as <span className="italic font-normal">Friends</span>
                </h3>
                <p className="font-sans text-[10px] uppercase tracking-widest text-[#1A1A1A]/50">
                  Connect & chat with curators across Snap Grid
                </p>
              </div>
              <button
                onClick={() => setShowAddFriendModal(false)}
                className="p-1 rounded-full hover:bg-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search filter */}
            <div className="relative my-4">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search curators by name or handle..."
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#1A1A1A]/15 rounded-xl pl-9 pr-3 py-2 text-xs font-sans focus:outline-none focus:border-black"
              />
            </div>

            {/* List of curators to add */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {allCurators
                .filter(
                  (c) =>
                    c.username.toLowerCase().includes(friendSearchQuery.toLowerCase()) ||
                    c.fullName.toLowerCase().includes(friendSearchQuery.toLowerCase())
                )
                .map((curator) => {
                  const isAlreadyFriend = friends.includes(curator.username);
                  return (
                    <div
                      key={curator.id}
                      className="p-3 bg-white rounded-xl border border-[#1A1A1A]/10 flex items-center justify-between hover:border-black transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={curator.avatar}
                          alt={curator.username}
                          className="w-10 h-10 rounded-full object-cover border border-[#1A1A1A]/20"
                        />
                        <div>
                          <h4 className="font-sans font-bold text-xs text-[#1A1A1A]">
                            {curator.fullName}
                          </h4>
                          <span className="font-sans text-[10px] text-[#1A1A1A]/60 block font-mono">
                            @{curator.username}
                          </span>
                          <span className="font-serif-editorial text-[11px] text-[#1A1A1A]/70 line-clamp-1">
                            {curator.bio}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddNewFriendChat(curator)}
                        className={`px-3 py-1.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shrink-0 ${
                          isAlreadyFriend
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-black text-white hover:bg-neutral-800'
                        }`}
                      >
                        {isAlreadyFriend ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Chat</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            <span>Add & Chat</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Pick Short / Reel to Send into Chat */}
      {showReelPickerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] text-[#1A1A1A] w-full max-w-lg rounded-2xl p-6 border border-[#1A1A1A]/15 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif-editorial text-xl font-light">
                  Send Short to <span className="italic font-normal">@{activeConv?.username}</span>
                </h3>
              </div>
              <button
                onClick={() => setShowReelPickerModal(false)}
                className="p-1 rounded-full hover:bg-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-sans text-xs text-[#1A1A1A]/60 my-3">
              Select a Short from the gallery to share directly into your chat letter:
            </p>

            {/* Grid of available shorts */}
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
              {availableReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => handleSendSharedReel(reel)}
                  className="relative aspect-[4/5] rounded-xl overflow-hidden border border-black/15 shadow cursor-pointer group hover:scale-[1.02] transition-transform"
                >
                  <img
                    src={reel.videoPoster}
                    alt={reel.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[9px] font-sans font-bold uppercase text-white">
                    @{reel.username}
                  </div>
                  <div className="absolute bottom-2 inset-x-2 text-white">
                    <p className="font-serif-editorial text-xs line-clamp-1">{reel.caption}</p>
                    <span className="font-sans text-[9px] uppercase font-bold tracking-wider text-rose-300 block mt-0.5">
                      Tap to Send Short →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
