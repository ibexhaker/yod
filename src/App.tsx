/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_REELS,
  DEFAULT_ACCOUNTS,
} from './data';
import { Post, Story, UserProfile, UserAccount, AppNotification, Conversation, ReelItem, AppTheme } from './types';
import { NavigationRail } from './components/NavigationRail';
import { PostCard } from './components/PostCard';
import { FeaturedPost } from './components/FeaturedPost';
import { StoryViewerModal } from './components/StoryViewerModal';
import { NewPostModal } from './components/NewPostModal';
import { ExploreView } from './components/ExploreView';
import { ProfileView } from './components/ProfileView';
import { DirectMessagesDrawer } from './components/DirectMessagesDrawer';
import { RightSidebar } from './components/RightSidebar';
import { ShareModal } from './components/ShareModal';
import { PhotoDetailModal } from './components/PhotoDetailModal';
import { EditPostModal } from './components/EditPostModal';
import { OmniAssistant } from './components/OmniAssistant';
import { SnapGridLogo } from './components/SnapGridLogo';
import { AuthModal } from './components/AuthModal';
import { ReelsView } from './components/ReelsView';
import { THEMES, THEME_STYLES } from './utils/theme';
import { sound } from './utils/audio';
import {
  Plus,
  Compass,
  Heart,
  Send,
  Home,
  Bookmark,
  User,
  Sparkles,
  Smartphone,
  Monitor,
  Menu,
  X,
  Volume2,
  VolumeX,
  Clapperboard,
  LogOut,
  Flame,
  Award,
  Users,
  MessageCircle,
} from 'lucide-react';

const STORAGE_ACCOUNTS_KEY = 'snapgrid_accounts_v5';
const STORAGE_ACTIVE_USER_KEY = 'snapgrid_active_user_v5';

export default function App() {
  // 1. Account & Auth State
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_ACCOUNTS;
  });

  const [currentAccount, setCurrentAccount] = useState<UserAccount | null>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_ACTIVE_USER_KEY);
      if (savedId) {
        const found = accounts.find((a) => a.id === savedId);
        if (found) return found;
      }
    } catch (e) {
      // ignore
    }
    // Auth gate requirement: user creates or picks account to enter
    return null;
  });

  // 2. Main content & shorts state
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [reels, setReels] = useState<ReelItem[]>(INITIAL_REELS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);

  // 3. Audio & UI view states
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sound.isEnabled());
  const [activeTab, setActiveTab] = useState<string>('feed'); // 'feed' | 'explore' | 'reels' | 'studio' | 'messages' | 'activity' | 'profile'
  const [viewingCuratorUsername, setViewingCuratorUsername] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [inspectedPhoto, setInspectedPhoto] = useState<any | null>(null);
  const [isMobileSimMode, setIsMobileSimMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    try {
      const savedTheme = localStorage.getItem('snapgrid_theme_v5') as AppTheme;
      if (savedTheme && ['white-blue', 'blue-black', 'white-black'].includes(savedTheme)) {
        return savedTheme;
      }
    } catch (e) {}
    return 'white-blue'; // Default: White & Blue
  });
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isOmniOpen, setIsOmniOpen] = useState(false);

  const feedScrollRef = useRef<HTMLDivElement>(null);

  // Save accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      // ignore
    }
  }, [accounts]);

  // Save active session
  useEffect(() => {
    try {
      if (currentAccount) {
        localStorage.setItem(STORAGE_ACTIVE_USER_KEY, currentAccount.id);
      } else {
        localStorage.removeItem(STORAGE_ACTIVE_USER_KEY);
      }
    } catch (e) {
      // ignore
    }
  }, [currentAccount]);

  const handleToggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
    if (next) {
      sound.playLikeChime();
    }
  };

  // Theme Handlers
  const handleSelectTheme = (newTheme: AppTheme) => {
    sound.playPop();
    setCurrentTheme(newTheme);
    try {
      localStorage.setItem('snapgrid_theme_v5', newTheme);
    } catch (e) {}
    if (currentAccount) {
      const updated = { ...currentAccount, themePreference: newTheme };
      setCurrentAccount(updated);
      setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }
  };

  const handleSaveEditedPost = (updatedPost: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    if (inspectedPhoto && inspectedPhoto.id === updatedPost.id) {
      setInspectedPhoto(updatedPost);
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (account: UserAccount) => {
    const fullAccount: UserAccount = {
      ...account,
      friends: account.friends || ['aurora_lens', 'atelier_nord'],
    };

    if (fullAccount.themePreference) {
      setCurrentTheme(fullAccount.themePreference);
      try {
        localStorage.setItem('snapgrid_theme_v5', fullAccount.themePreference);
      } catch (e) {}
    }

    setAccounts((prev) => {
      const exists = prev.some((a) => a.id === fullAccount.id);
      if (exists) {
        return prev.map((a) => (a.id === fullAccount.id ? fullAccount : a));
      }
      return [fullAccount, ...prev];
    });

    setCurrentAccount(fullAccount);
    setActiveTab('feed');
  };

  const handleLogout = () => {
    sound.playPop();
    setCurrentAccount(null);
    setViewingCuratorUsername(null);
  };

  // Add/Toggle Friend System
  const handleToggleFriend = (targetUsername: string) => {
    if (!currentAccount) return;

    const currentFriends = currentAccount.friends || [];
    const isFriend = currentFriends.includes(targetUsername);
    let updatedFriends: string[];

    if (isFriend) {
      updatedFriends = currentFriends.filter((u) => u !== targetUsername);
    } else {
      updatedFriends = [...currentFriends, targetUsername];
      sound.playLikeChime();

      // Add notification
      const newNotif: AppNotification = {
        id: `notif_friend_${Date.now()}`,
        type: 'friend',
        username: targetUsername,
        userImg:
          accounts.find((a) => a.username === targetUsername)?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        timeAgo: 'Just now',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      // Ensure conversation exists and is marked as friend
      setConversations((prev) => {
        const found = prev.find((c) => c.username === targetUsername);
        if (found) {
          return prev.map((c) => (c.username === targetUsername ? { ...c, isFriend: true } : c));
        } else {
          const curator = accounts.find((a) => a.username === targetUsername);
          const newConv: Conversation = {
            id: `conv_${Date.now()}`,
            username: targetUsername,
            fullName: curator?.fullName || targetUsername,
            userImg:
              curator?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            lastMessage: 'You are now friends! Say hello.',
            timeAgo: 'Just now',
            unread: false,
            isFriend: true,
            messages: [
              {
                id: `m_${Date.now()}`,
                sender: 'other',
                text: 'Connected as friends! Feel free to send shorts or messages.',
                timestamp: 'Just now',
              },
            ],
          };
          return [newConv, ...prev];
        }
      });
    }

    const updatedAccount: UserAccount = {
      ...currentAccount,
      friends: updatedFriends,
    };

    setCurrentAccount(updatedAccount);
    setAccounts((prev) => prev.map((a) => (a.id === updatedAccount.id ? updatedAccount : a)));
  };

  // Follow / Unfollow System
  const handleToggleFollow = (targetUsername: string) => {
    if (!currentAccount) return;

    const isFollowing = currentAccount.followingUsernames?.includes(targetUsername);
    let updatedFollowing: string[];

    if (isFollowing) {
      updatedFollowing = (currentAccount.followingUsernames || []).filter(
        (u) => u !== targetUsername
      );
    } else {
      updatedFollowing = [...(currentAccount.followingUsernames || []), targetUsername];
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        type: 'follow',
        username: currentAccount.username,
        userImg: currentAccount.avatar,
        timeAgo: 'Just now',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    const updatedAccount: UserAccount = {
      ...currentAccount,
      followingCount: Math.max(0, currentAccount.followingCount + (isFollowing ? -1 : 1)),
      followingUsernames: updatedFollowing,
    };

    setCurrentAccount(updatedAccount);
    setAccounts((prev) => prev.map((a) => (a.id === updatedAccount.id ? updatedAccount : a)));
  };

  // Like Toggle
  const handleToggleLike = (postId: string | number) => {
    if (!currentAccount) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newLiked = !post.isLiked;
          const newLikes = newLiked ? post.likes + 1 : Math.max(0, post.likes - 1);

          const currentLiked = currentAccount.likedPostIds || [];
          const updatedLiked = newLiked
            ? [...currentLiked, postId]
            : currentLiked.filter((id) => id !== postId);

          const updatedAccount = { ...currentAccount, likedPostIds: updatedLiked };
          setCurrentAccount(updatedAccount);

          if (newLiked) {
            const newNotif: AppNotification = {
              id: `notif_like_${Date.now()}`,
              type: 'like',
              username: currentAccount.username,
              userImg: currentAccount.avatar,
              postImg: post.postImg,
              timeAgo: 'Just now',
              read: false,
            };
            setNotifications((prev) => [newNotif, ...prev]);
          }

          return {
            ...post,
            isLiked: newLiked,
            likes: newLikes,
          };
        }
        return post;
      })
    );
  };

  // Bookmark / Save Toggle
  const handleToggleSave = (postId: string | number) => {
    if (!currentAccount) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newSaved = !post.isSaved;

          const currentSaved = currentAccount.savedPostIds || [];
          const updatedSaved = newSaved
            ? [...currentSaved, postId]
            : currentSaved.filter((id) => id !== postId);

          const updatedAccount = { ...currentAccount, savedPostIds: updatedSaved };
          setCurrentAccount(updatedAccount);

          return {
            ...post,
            isSaved: newSaved,
          };
        }
        return post;
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId: string | number, text: string) => {
    if (!currentAccount) return;

    const newComment = {
      id: `c_${Date.now()}`,
      username: currentAccount.username,
      userImg: currentAccount.avatar,
      text,
      timestamp: 'Just now',
      likes: 0,
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  // Publish New Monograph / Post
  const handlePublishPost = (newPostData: Partial<Post>) => {
    if (!currentAccount) return;

    const newPost: Post = {
      id: Date.now(),
      userId: currentAccount.id,
      username: currentAccount.username,
      userImg: currentAccount.avatar,
      location: newPostData.location || 'Curator Studio, Global',
      postImg:
        newPostData.postImg ||
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
      caption:
        newPostData.caption ||
        'New monograph published on Snap Grid. Natural light, space, and architectural resonance.',
      likes: 1,
      isLiked: true,
      isSaved: false,
      comments: [],
      timestamp: 'Just now',
      isVerified: true,
      filter: newPostData.filter || 'none',
      exif: {
        camera: 'Leica Q3',
        lens: 'Summilux 28mm f/1.7',
        aperture: 'f/2.8',
        shutter: '1/800s',
        iso: 100,
      },
    };

    sound.playCameraShutter();
    setPosts([newPost, ...posts]);

    const updatedAccount = {
      ...currentAccount,
      postsCount: (currentAccount.postsCount || 0) + 1,
      streakDays: (currentAccount.streakDays || 1) + 1,
    };
    setCurrentAccount(updatedAccount);
    setAccounts((prev) => prev.map((a) => (a.id === updatedAccount.id ? updatedAccount : a)));

    setActiveTab('feed');
    if (feedScrollRef.current) {
      feedScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Direct Message Sending (with optional shared short!)
  const handleSendMessage = (convId: string, text: string, sharedReel?: ReelItem) => {
    sound.playPop();
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const newMsg = {
            id: `msg_${Date.now()}`,
            sender: 'user' as const,
            text,
            timestamp: 'Just now',
            sharedReel,
          };
          return {
            ...c,
            lastMessage: sharedReel ? `Shared a Short: @${sharedReel.username}` : text,
            timeAgo: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  // Send Short / Reel to Friend in Chat
  const handleSendShortToFriend = (friendUsername: string, reel: ReelItem, note?: string) => {
    sound.playCameraShutter();
    const existingConv = conversations.find(
      (c) => c.username.toLowerCase() === friendUsername.toLowerCase()
    );

    const messageText = note || `Check out this Short from @${reel.username}!`;

    if (existingConv) {
      handleSendMessage(existingConv.id, messageText, reel);
    } else {
      const curator = accounts.find((a) => a.username === friendUsername);
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        username: friendUsername,
        fullName: curator?.fullName || friendUsername,
        userImg:
          curator?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        lastMessage: `Shared a Short: @${reel.username}`,
        timeAgo: 'Just now',
        unread: false,
        isFriend: true,
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender: 'user',
            text: messageText,
            timestamp: 'Just now',
            sharedReel: reel,
          },
        ],
      };
      setConversations([newConv, ...conversations]);
    }
  };

  // Story Reply via Direct Message
  const handleStoryReply = (authorUsername: string, text: string) => {
    const existing = conversations.find(
      (c) => c.username.toLowerCase() === authorUsername.toLowerCase()
    );

    if (existing) {
      handleSendMessage(existing.id, text);
    } else {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        username: authorUsername,
        fullName: authorUsername.replace('_', ' '),
        userImg:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        lastMessage: text,
        timeAgo: 'Just now',
        unread: false,
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender: 'user',
            text,
            timestamp: 'Just now',
          },
        ],
      };
      setConversations([newConv, ...conversations]);
    }
  };

  const handleShareToUser = (username: string) => {
    const targetConv = conversations.find((c) => c.username === username);
    if (targetConv && sharePost) {
      handleSendMessage(targetConv.id, `Shared a publication: "${sharePost.caption.slice(0, 50)}..."`);
    }
  };

  // Watch creator posts & monographs (from Shorts, Chat, or Feed)
  const handleViewUserPosts = (username: string) => {
    sound.playPop();
    setViewingCuratorUsername(username);
    setActiveTab('profile');
    if (feedScrollRef.current) {
      feedScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Derived counters
  const unreadMessagesCount = conversations.filter((c) => c.unread).length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const totalInteractions = posts.reduce((acc, p) => acc + p.likes + p.comments.length, 0);
  const savedPosts = posts.filter((p) => p.isSaved);

  const featuredPost = posts[0];
  const streamPosts = posts.slice(1);

  // If user has not created or selected an account yet, present the full welcoming Auth Gateway!
  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex flex-col justify-between">
        <AuthModal onLoginSuccess={handleLoginSuccess} existingAccounts={accounts} />
      </div>
    );
  }

  // Profile data to display (either current logged in account or another creator clicked from Shorts)
  const isViewingSelf =
    !viewingCuratorUsername ||
    viewingCuratorUsername.toLowerCase() === currentAccount.username.toLowerCase();

  const activeViewingUser: UserProfile = isViewingSelf
    ? {
        id: currentAccount.id,
        username: currentAccount.username,
        fullName: currentAccount.fullName,
        avatar: currentAccount.avatar,
        bio: currentAccount.bio,
        website: currentAccount.website,
        postsCount: currentAccount.postsCount,
        followersCount: currentAccount.followersCount,
        followingCount: currentAccount.followingCount,
        isVerified: currentAccount.isVerified,
        streakDays: currentAccount.streakDays,
        curatorLevel: currentAccount.curatorLevel,
        tags: currentAccount.tags,
        joinedDate: currentAccount.joinedDate,
        friends: currentAccount.friends,
      }
    : (() => {
        const found = accounts.find((a) => a.username === viewingCuratorUsername);
        if (found) return found;
        return {
          id: `u_${viewingCuratorUsername}`,
          username: viewingCuratorUsername!,
          fullName: viewingCuratorUsername!.replace('_', ' ').toUpperCase(),
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
          bio: 'Visual curator & photographer sharing moments on Snap Grid.',
          postsCount: posts.filter((p) => p.username === viewingCuratorUsername).length,
          followersCount: 1250,
          followingCount: 340,
          isVerified: true,
          streakDays: 5,
          curatorLevel: 'Featured Creator',
          tags: ['#editorial', '#visuals', '#curation'],
          joinedDate: 'Joined 2026',
        };
      })();

  const activeThemeStyle = THEME_STYLES[currentTheme] || THEME_STYLES['white-blue'];

  return (
    <div className={`min-h-screen ${activeThemeStyle.rootBg} ${activeThemeStyle.textPrimary} flex flex-col font-sans-editorial antialiased transition-colors duration-200`}>
      {/* Mobile Top App Bar (visible on small screens) */}
      <header className={`md:hidden sticky top-0 z-40 ${activeThemeStyle.headerBg} backdrop-blur-md border-b ${activeThemeStyle.headerBorder} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <SnapGridLogo variant="horizontal" size={28} showSubtitle={false} />
        </div>

        <div className="flex items-center gap-2">
          {/* Omni AI Button (Mobile) */}
          <button
            onClick={() => {
              sound.playPop();
              setIsOmniOpen(true);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Ask Omni - AI Guide"
          >
            <Sparkles className="w-5 h-5 animate-pulse text-blue-500" />
          </button>

          <button
            onClick={handleToggleSound}
            className={`p-1.5 rounded-full border transition-all ${
              soundEnabled
                ? 'bg-neutral-100 border-[#1A1A1A]/10 text-[#1A1A1A]'
                : 'bg-white border-[#1A1A1A]/15 text-[#1A1A1A]/40'
            }`}
            title="Audio feedback"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsMobileSimMode(!isMobileSimMode)}
            className="p-1.5 text-[#1A1A1A]/70 hover:text-[#1A1A1A] rounded-full border border-[#1A1A1A]/10"
            title="Toggle Mobile Prototype Mockup"
          >
            {isMobileSimMode ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="p-1.5 text-[#1A1A1A] hover:bg-neutral-100 rounded-full"
            aria-label="New publication"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('messages');
            }}
            className="p-1.5 text-[#1A1A1A] hover:bg-neutral-100 rounded-full relative"
            aria-label="Direct messages"
          >
            <Send className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#ed4956] absolute top-1 right-1" />
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      {isMobileSimMode ? (
        /* Mobile Simulator / Phone Mockup View */
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-neutral-200">
          <div className="w-full max-w-[420px] h-[90vh] max-h-[820px] bg-white border border-[#1A1A1A]/20 shadow-2xl flex flex-col relative overflow-hidden rounded-3xl">
            {/* Phone Top Notch / Header */}
            <div className="px-5 py-3.5 border-b border-[#1A1A1A]/10 bg-white flex items-center justify-between shrink-0">
              <SnapGridLogo variant="horizontal" size={24} showSubtitle={false} />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    setIsOmniOpen(true);
                  }}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="Ask Omni AI"
                >
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                </button>
                <button
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="p-1 text-[#1A1A1A] hover:opacity-70"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="p-1 text-[#1A1A1A] hover:opacity-70 relative"
                >
                  <Send className="w-5 h-5" />
                  {unreadMessagesCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#ed4956] absolute top-0 right-0" />
                  )}
                </button>
              </div>
            </div>

            {/* Phone Scrollable Content */}
            <div ref={feedScrollRef} className="flex-1 overflow-y-auto pb-16">
              {activeTab === 'reels' ? (
                <ReelsView
                  reels={reels}
                  conversations={conversations}
                  onSelectUser={handleViewUserPosts}
                  onNavigateToPosts={handleViewUserPosts}
                  onSendShortToFriend={handleSendShortToFriend}
                />
              ) : activeTab === 'explore' ? (
                <div className="p-3">
                  <ExploreView onSelectPhoto={(photo) => setInspectedPhoto(photo)} />
                </div>
              ) : activeTab === 'messages' ? (
                <div className="p-2 h-full">
                  <DirectMessagesDrawer
                    conversations={conversations}
                    availableReels={reels}
                    allCurators={accounts}
                    friends={currentAccount.friends || []}
                    onSendMessage={handleSendMessage}
                    onAddFriend={handleToggleFriend}
                    onOpenReel={() => setActiveTab('reels')}
                    onSelectUserPosts={handleViewUserPosts}
                  />
                </div>
              ) : activeTab === 'profile' ? (
                <div className="p-3">
                  <ProfileView
                    user={activeViewingUser}
                    posts={posts}
                    savedPosts={savedPosts}
                    isCurrentUser={isViewingSelf}
                    isFriend={currentAccount.friends?.includes(activeViewingUser.username)}
                    onSelectPost={(post) => setInspectedPhoto(post)}
                    onUpdateBio={(bio) => {
                      const updated = { ...currentAccount, bio };
                      setCurrentAccount(updated);
                      setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
                    }}
                    onLogout={handleLogout}
                    onToggleFriend={handleToggleFriend}
                    onStartChat={(username) => {
                      const conv = conversations.find((c) => c.username === username);
                      setActiveTab('messages');
                    }}
                    onBackToMyProfile={() => setViewingCuratorUsername(null)}
                    onEditPost={(post) => setEditingPost(post)}
                    onSelectTheme={handleSelectTheme}
                    currentTheme={currentTheme}
                  />
                </div>
              ) : (
                <>
                  {/* Stories Bar */}
                  <div className="px-4 py-3 border-b border-[#1A1A1A]/5 flex items-center gap-3 overflow-x-auto">
                    <div
                      onClick={() => setIsNewPostModalOpen(true)}
                      className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#1A1A1A]/30 flex items-center justify-center text-xs font-bold bg-[#FAF9F6]">
                        <Plus className="w-5 h-5 text-[#1A1A1A]" />
                      </div>
                      <span className="text-[10px] font-sans text-[#1A1A1A]/60">Your Story</span>
                    </div>
                    {stories.map((story, index) => (
                      <div
                        key={story.id}
                        onClick={() => setActiveStoryIndex(index)}
                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                      >
                        <div
                          className={`w-14 h-14 rounded-full p-[2px] ${
                            story.hasUnseen
                              ? 'border-2 border-[#1A1A1A]'
                              : 'border border-[#1A1A1A]/20'
                          }`}
                        >
                          <img
                            src={story.userImg}
                            alt={story.username}
                            className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="text-[10px] font-sans text-[#1A1A1A] max-w-[60px] truncate">
                          {story.username}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Feed Stream */}
                  <div className="p-3">
                    {posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        currentUsername={currentAccount.username}
                        isFollowing={currentAccount.followingUsernames?.includes(post.username)}
                        onToggleFollow={handleToggleFollow}
                        onToggleLike={handleToggleLike}
                        onToggleSave={handleToggleSave}
                        onAddComment={handleAddComment}
                        onOpenShareModal={(p) => setSharePost(p)}
                        onSelectUser={(u) => handleViewUserPosts(u)}
                        onEditPost={(p) => setEditingPost(p)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Phone Bottom Tab Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-white border-t border-[#1A1A1A]/10 py-3 px-5 flex items-center justify-between z-30">
              <button
                onClick={() => {
                  sound.playPop();
                  setViewingCuratorUsername(null);
                  setActiveTab('feed');
                }}
                className={`p-1 ${activeTab === 'feed' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'}`}
                title="Feed"
              >
                <Home className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('reels');
                }}
                className={`p-1 ${activeTab === 'reels' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'}`}
                title="Snaps / Reels"
              >
                <Clapperboard className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setIsNewPostModalOpen(true);
                }}
                className="p-1.5 bg-[#1A1A1A] text-white rounded-md"
                title="New Publication"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('messages');
                }}
                className={`p-1 relative ${activeTab === 'messages' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'}`}
                title="Chat with Friends"
              >
                <Send className="w-5 h-5" />
                {unreadMessagesCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#ed4956] absolute -top-0.5 -right-0.5" />
                )}
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setViewingCuratorUsername(null);
                  setActiveTab('profile');
                }}
                className="p-0.5"
                title="Profile"
              >
                <img
                  src={currentAccount.avatar}
                  alt={currentAccount.username}
                  className="w-6 h-6 rounded-full object-cover border border-[#1A1A1A]"
                />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Full Desktop / Tablet Editorial Studio Workspace */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Rail (Desktop) */}
          <div className="hidden md:flex">
            <NavigationRail
              activeTab={activeTab}
              setActiveTab={(tab) => {
                if (tab === 'studio') {
                  setIsNewPostModalOpen(true);
                } else {
                  if (tab === 'profile') {
                    setViewingCuratorUsername(null);
                  }
                  setActiveTab(tab);
                }
              }}
              user={activeViewingUser}
              unreadMessagesCount={unreadMessagesCount}
              unreadNotifsCount={unreadNotifsCount}
              isMobileSimMode={isMobileSimMode}
              setIsMobileSimMode={setIsMobileSimMode}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onLogout={handleLogout}
              onOpenOmni={() => setIsOmniOpen(true)}
            />
          </div>

          {/* Main Stage */}
          <main className="flex-1 flex flex-col overflow-y-auto" ref={feedScrollRef}>
            {/* Editorial Top Header */}
            <header className={`px-6 md:px-12 py-5 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between border-b ${activeThemeStyle.headerBorder} shrink-0 gap-4 ${activeThemeStyle.headerBg}`}>
              <div className="flex items-center gap-5">
                <div
                  onClick={() => {
                    sound.playPop();
                    setViewingCuratorUsername(null);
                    setActiveTab('feed');
                  }}
                  className="bg-black text-white p-2.5 rounded-2xl shadow-md cursor-pointer hover:scale-105 transition-transform"
                >
                  <SnapGridLogo variant="icon" theme="dark" size={40} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif-editorial font-light tracking-tighter text-[#1A1A1A]">
                    Snap <span className="italic serif opacity-70">Grid</span>
                  </h1>
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] mt-1 opacity-60 flex items-center gap-2">
                    <span>Curator Platform</span>
                    <span>•</span>
                    <span className="font-bold tracking-widest text-[#1A1A1A]">Fine Art Gallery</span>
                  </p>
                </div>
              </div>

              {/* Account Quick Badge & Action Buttons */}
              <div className="flex items-center gap-3 md:gap-5 font-sans text-[11px] uppercase tracking-widest font-semibold flex-wrap">
                {/* Omni AI Assistant Launcher */}
                <button
                  id="header-omni-btn"
                  onClick={() => {
                    sound.playPop();
                    setIsOmniOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-full font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-105 flex items-center gap-1.5"
                  title="Ask Omni - Intelligent Platform Guide"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
                  <span>Omni AI</span>
                </button>

                {/* Theme Palette Switcher */}
                <div className="flex items-center gap-1 bg-black/5 p-1 rounded-full border border-black/10">
                  {THEMES.map((th) => {
                    const isCurrent = currentTheme === th.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => handleSelectTheme(th.id)}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase transition-all flex items-center gap-1 ${
                          isCurrent
                            ? 'bg-white shadow text-neutral-900 border border-black/10'
                            : 'text-neutral-500 hover:text-black'
                        }`}
                        title={`Switch theme: ${th.name}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${th.previewAccent}`} />
                        <span className="hidden xl:inline">{th.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Curator Badge with Switcher Trigger */}
                <div
                  onClick={() => {
                    sound.playPop();
                    setViewingCuratorUsername(null);
                    setActiveTab('profile');
                  }}
                  className="flex items-center gap-2.5 bg-neutral-100 hover:bg-neutral-200 border border-[#1A1A1A]/10 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                  title="View your portfolio or switch account"
                >
                  <img
                    src={currentAccount.avatar}
                    alt={currentAccount.username}
                    className="w-5 h-5 rounded-full object-cover border border-[#1A1A1A]/20"
                  />
                  <span className="font-bold text-[#1A1A1A] lowercase">@{currentAccount.username}</span>
                  {currentAccount.streakDays && (
                    <span className="text-[10px] text-amber-600 font-bold flex items-center">
                      🔥{currentAccount.streakDays}d
                    </span>
                  )}
                </div>

                <button
                  id="header-curate-btn"
                  onClick={() => {
                    sound.playPop();
                    setActiveTab('explore');
                  }}
                  className={`hover:underline decoration-1 underline-offset-8 transition-colors ${
                    activeTab === 'explore' ? 'underline font-bold' : 'opacity-70'
                  }`}
                >
                  Curate
                </button>

                <button
                  id="header-reels-btn"
                  onClick={() => {
                    sound.playPop();
                    setActiveTab('reels');
                  }}
                  className={`hover:underline decoration-1 underline-offset-8 transition-colors ${
                    activeTab === 'reels' ? 'underline font-bold' : 'opacity-70'
                  }`}
                >
                  Snaps
                </button>

                <button
                  id="header-chat-btn"
                  onClick={() => {
                    sound.playPop();
                    setActiveTab('messages');
                  }}
                  className={`hover:underline decoration-1 underline-offset-8 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'messages' ? 'underline font-bold text-black' : 'opacity-70'
                  }`}
                  title="Chat with friends & send letters"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chat ({conversations.length})</span>
                  {unreadMessagesCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#ed4956]" />
                  )}
                </button>

                <button
                  id="header-archives-btn"
                  onClick={() => {
                    sound.playPop();
                    setViewingCuratorUsername(null);
                    setActiveTab('profile');
                  }}
                  className={`hover:underline decoration-1 underline-offset-8 transition-colors ${
                    activeTab === 'profile' && isViewingSelf ? 'underline font-bold' : 'opacity-70'
                  }`}
                >
                  Archives ({savedPosts.length})
                </button>

                <button
                  id="header-new-post-btn"
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-full font-bold hover:bg-black hover:scale-105 transition-all shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Monograph</span>
                </button>
              </div>
            </header>

            {/* Main Stage Body based on activeTab */}
            <div className="flex-1 p-6 md:p-12 max-w-7xl w-full mx-auto">
              {activeTab === 'reels' ? (
                <div className="max-w-md mx-auto h-[78vh] rounded-2xl overflow-hidden shadow-2xl border border-black/15">
                  <ReelsView
                    reels={reels}
                    conversations={conversations}
                    onSelectUser={handleViewUserPosts}
                    onNavigateToPosts={handleViewUserPosts}
                    onSendShortToFriend={handleSendShortToFriend}
                  />
                </div>
              ) : activeTab === 'explore' ? (
                <ExploreView onSelectPhoto={(photo) => setInspectedPhoto(photo)} />
              ) : activeTab === 'profile' ? (
                <ProfileView
                  user={activeViewingUser}
                  posts={posts}
                  savedPosts={savedPosts}
                  isCurrentUser={isViewingSelf}
                  isFriend={currentAccount.friends?.includes(activeViewingUser.username)}
                  onSelectPost={(post) => setInspectedPhoto(post)}
                  onUpdateBio={(bio) => {
                    const updated = { ...currentAccount, bio };
                    setCurrentAccount(updated);
                    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
                  }}
                  onLogout={handleLogout}
                  onToggleFriend={handleToggleFriend}
                  onStartChat={(username) => {
                    setActiveTab('messages');
                  }}
                  onBackToMyProfile={() => setViewingCuratorUsername(null)}
                  onEditPost={(p) => setEditingPost(p)}
                  onSelectTheme={handleSelectTheme}
                  currentTheme={currentTheme}
                />
              ) : activeTab === 'messages' ? (
                <DirectMessagesDrawer
                  conversations={conversations}
                  availableReels={reels}
                  allCurators={accounts}
                  friends={currentAccount.friends || []}
                  onSendMessage={handleSendMessage}
                  onAddFriend={handleToggleFriend}
                  onOpenReel={() => setActiveTab('reels')}
                  onSelectUserPosts={handleViewUserPosts}
                />
              ) : activeTab === 'activity' ? (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 p-6 rounded-2xl">
                    <h3 className="font-serif-editorial text-2xl font-light text-[#1A1A1A] mb-1">
                      Curator <span className="italic opacity-70">Digest</span>
                    </h3>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-[#1A1A1A]/50">
                      Recent interactions across your publications and friends
                    </p>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="bg-white border border-[#1A1A1A]/10 p-4 rounded-xl flex items-center justify-between shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={n.userImg}
                            alt={n.username}
                            className="w-10 h-10 rounded-full object-cover border border-[#1A1A1A]/10"
                          />
                          <div>
                            <p className="font-sans text-xs text-[#1A1A1A]">
                              <strong className="font-bold">@{n.username}</strong>{' '}
                              {n.type === 'like' && 'appreciated your publication.'}
                              {n.type === 'comment' && `stated: "${n.commentText}"`}
                              {n.type === 'follow' && 'followed your portfolio.'}
                              {n.type === 'friend' && 'connected with you as a friend.'}
                            </p>
                            <span className="font-sans text-[10px] text-[#1A1A1A]/40 uppercase tracking-wider">
                              {n.timeAgo}
                            </span>
                          </div>
                        </div>
                        {n.postImg && (
                          <img
                            src={n.postImg}
                            alt="Post snippet"
                            className="w-10 h-10 object-cover rounded-md border border-[#1A1A1A]/10"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Primary Editorial Feed View */
                <div className="space-y-8">
                  {/* Story Highlights Bar */}
                  <section className="bg-[#FAF9F6] border border-[#1A1A1A]/10 p-5 rounded-2xl overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">
                        Curator Stories
                      </span>
                      <span className="font-sans text-[9px] uppercase tracking-widest opacity-40">
                        {stories.length} Dispatches
                      </span>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 overflow-x-auto pb-2">
                      {/* Add story button */}
                      <button
                        onClick={() => setIsNewPostModalOpen(true)}
                        className="flex flex-col items-center gap-2 shrink-0 group"
                      >
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1A1A1A]/30 flex items-center justify-center bg-white group-hover:border-[#1A1A1A] transition-colors shadow-sm">
                          <Plus className="w-6 h-6 text-[#1A1A1A]" />
                        </div>
                        <span className="font-sans text-[10px] uppercase tracking-wider font-semibold text-[#1A1A1A]/70">
                          Create
                        </span>
                      </button>

                      {/* Story items */}
                      {stories.map((story, idx) => (
                        <div
                          key={story.id}
                          onClick={() => setActiveStoryIndex(idx)}
                          className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
                        >
                          <div
                            className={`w-16 h-16 rounded-full p-[2px] transition-transform group-hover:scale-105 shadow-sm ${
                              story.hasUnseen
                                ? 'border-2 border-[#1A1A1A]'
                                : 'border border-[#1A1A1A]/20 opacity-70'
                            }`}
                          >
                            <img
                              src={story.userImg}
                              alt={story.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#1A1A1A]/80 max-w-[70px] truncate">
                            {story.username}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Editorial Grid Columns: Featured Spotlight + Stream Column */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Featured Hero Item + Feed Cards */}
                    <div className="lg:col-span-7 space-y-8">
                      {featuredPost && (
                        <FeaturedPost
                          post={featuredPost}
                          onToggleLike={handleToggleLike}
                          onSelectUser={(u) => handleViewUserPosts(u)}
                        />
                      )}

                      {/* Stream Feed Cards */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
                          <h3 className="font-sans text-xs uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/60">
                            Chronicle Stream
                          </h3>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#1A1A1A]/40">
                            {posts.length} Publications
                          </span>
                        </div>

                        {streamPosts.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            currentUsername={currentAccount.username}
                            isFollowing={currentAccount.followingUsernames?.includes(post.username)}
                            onToggleFollow={handleToggleFollow}
                            onToggleLike={handleToggleLike}
                            onToggleSave={handleToggleSave}
                            onAddComment={handleAddComment}
                            onOpenShareModal={(p) => setSharePost(p)}
                            onSelectUser={(u) => handleViewUserPosts(u)}
                            onEditPost={(p) => setEditingPost(p)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Editorial Secondary Showcase & Mini Grid Preview */}
                    <div className="lg:col-span-5 space-y-8">
                      {/* Secondary Curated Cards */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
                          <h3 className="font-sans text-xs uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/60">
                            Selected Monographs
                          </h3>
                        </div>

                        {posts.slice(1, 3).map((post) => (
                          <div
                            key={post.id}
                            className="bg-[#F5F5F5] p-5 flex gap-5 border border-black/5 transition-all hover:border-black/15 shadow-sm rounded-xl"
                          >
                            <div
                              onClick={() => setInspectedPhoto(post)}
                              className="w-28 h-28 bg-[#D1D1D1] shrink-0 bg-cover bg-center cursor-pointer overflow-hidden group rounded-lg"
                              style={{ backgroundImage: `url("${post.postImg}")` }}
                            />
                            <div className="flex flex-col justify-between py-1 flex-1">
                              <div>
                                <h4 className="text-lg font-serif-editorial italic text-[#1A1A1A]">
                                  {post.caption.split('.')[0] || 'Visual Study'}
                                </h4>
                                <p className="font-sans text-xs mt-1.5 opacity-60 leading-relaxed line-clamp-2">
                                  {post.caption}
                                </p>
                              </div>
                              <div className="flex items-center justify-between font-sans text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-black/5">
                                <span>{post.likes.toLocaleString()} Appreciations</span>
                                <button
                                  onClick={() => handleToggleLike(post.id)}
                                  className={`transition-colors ${
                                    post.isLiked ? 'text-[#ed4956]' : 'opacity-40 hover:opacity-80'
                                  }`}
                                >
                                  {post.isLiked ? 'Appreciated' : 'Appreciate'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Mini Grid Preview */}
                        <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 p-5 space-y-3 rounded-2xl shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold opacity-50">
                              Collection Preview
                            </span>
                            <button
                              onClick={() => setActiveTab('explore')}
                              className="font-sans text-[9px] uppercase tracking-wider text-[#1A1A1A] underline font-semibold"
                            >
                              Explore All
                            </button>
                          </div>

                          <div className="grid grid-cols-4 gap-2.5 h-24">
                            {posts.slice(0, 3).map((p) => (
                              <div
                                key={p.id}
                                onClick={() => setInspectedPhoto(p)}
                                className="bg-[#EAEAEA] bg-cover bg-center cursor-pointer grayscale hover:grayscale-0 transition-all border border-black/5 rounded-lg"
                                style={{ backgroundImage: `url("${p.postImg}")` }}
                              />
                            ))}
                            <button
                              onClick={() => setIsNewPostModalOpen(true)}
                              className="bg-[#EAEAEA] border border-dashed border-black/20 flex items-center justify-center font-sans text-xl opacity-50 hover:opacity-100 hover:bg-neutral-200 transition-all rounded-lg"
                              title="Publish new monograph"
                            >
                              <Plus className="w-5 h-5 text-[#1A1A1A]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar (Desktop) */}
          <RightSidebar
            notifications={notifications}
            onSelectTag={() => setActiveTab('explore')}
            onOpenStudio={() => setIsNewPostModalOpen(true)}
            totalInteractions={totalInteractions}
          />
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Phone layout) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#FDFCFB] border-t border-[#1A1A1A]/10 py-3 px-5 flex items-center justify-around z-40">
        <button
          onClick={() => {
            sound.playPop();
            setViewingCuratorUsername(null);
            setActiveTab('feed');
          }}
          className={`p-1.5 transition-colors ${
            activeTab === 'feed' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'
          }`}
          aria-label="Feed"
        >
          <Home className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            sound.playPop();
            setActiveTab('reels');
          }}
          className={`p-1.5 transition-colors ${
            activeTab === 'reels' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'
          }`}
          aria-label="Snaps"
        >
          <Clapperboard className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            sound.playPop();
            setIsNewPostModalOpen(true);
          }}
          className="p-2 bg-[#1A1A1A] text-white rounded-full shadow-md"
          aria-label="Add publication"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            sound.playPop();
            setActiveTab('messages');
          }}
          className={`p-1.5 transition-colors relative ${
            activeTab === 'messages' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'
          }`}
          aria-label="Chat with Friends"
        >
          <Send className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#ed4956] absolute top-1 right-1" />
          )}
        </button>
        <button
          onClick={() => {
            sound.playPop();
            setViewingCuratorUsername(null);
            setActiveTab('profile');
          }}
          className={`p-0.5 rounded-full border transition-all ${
            activeTab === 'profile' ? 'border-[#1A1A1A]' : 'border-transparent'
          }`}
          aria-label="Profile"
        >
          <img
            src={currentAccount.avatar}
            alt={currentAccount.username}
            className="w-6 h-6 rounded-full object-cover"
          />
        </button>
      </nav>

      {/* Floating Omni AI Guide Button (Always Accessible) */}
      <button
        onClick={() => {
          sound.playPop();
          setIsOmniOpen(true);
        }}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl items-center gap-2.5 border border-white/25 transition-all hover:scale-105 active:scale-95 group flex"
        title="Ask Omni - Intelligent AI Guide & Tour"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-sans font-black uppercase tracking-wider leading-none">
            Omni AI
          </span>
          <span className="text-[9px] text-cyan-200 font-sans tracking-tight leading-none mt-0.5">
            Tour & Help
          </span>
        </div>
      </button>

      {/* Floating Quick-Chat Bar (Desktop & Tablet) */}
      {activeTab !== 'messages' && !isMobileSimMode && (
        <button
          onClick={() => {
            sound.playPop();
            setActiveTab('messages');
          }}
          className="hidden md:flex fixed bottom-6 right-6 z-40 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2.5 rounded-full shadow-2xl items-center gap-2.5 border border-white/20 transition-all hover:scale-105 active:scale-95 group"
          title="Chat with your friends"
        >
          <div className="relative">
            <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            {unreadMessagesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#ed4956] absolute -top-0.5 -right-0.5 border border-[#1A1A1A]" />
            )}
          </div>
          <span className="text-xs font-sans font-bold uppercase tracking-wider">
            Chat with Friends
          </span>
          <span className="text-[10px] font-sans bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded-full">
            ● Active
          </span>
        </button>
      )}

      {/* Modals */}
      {/* 1. Story Viewer Modal with direct reply */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialStoryIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onSendStoryReply={handleStoryReply}
        />
      )}

      {/* 2. Studio New Post Modal */}
      {isNewPostModalOpen && (
        <NewPostModal
          onClose={() => setIsNewPostModalOpen(false)}
          onPublish={handlePublishPost}
        />
      )}

      {/* 3. Share Modal */}
      {sharePost && (
        <ShareModal
          post={sharePost}
          onClose={() => setSharePost(null)}
          onSendToUser={handleShareToUser}
        />
      )}

      {/* 4. Photo Inspection Modal */}
      {inspectedPhoto && (
        <PhotoDetailModal
          item={inspectedPhoto}
          isLiked={inspectedPhoto.isLiked}
          onClose={() => setInspectedPhoto(null)}
          onToggleLike={(id) => handleToggleLike(id)}
          onEditPost={(p) => {
            setInspectedPhoto(null);
            setEditingPost(p);
          }}
        />
      )}

      {/* 5. Post Editing Modal (Filters & Curves) */}
      <EditPostModal
        post={editingPost}
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSave={handleSaveEditedPost}
        theme={currentTheme}
      />

      {/* 6. Omni AI Assistant Guide Modal */}
      <OmniAssistant
        isOpen={isOmniOpen}
        onClose={() => setIsOmniOpen(false)}
        theme={currentTheme}
        onSelectTab={(tab) => {
          sound.playPop();
          setActiveTab(tab);
          setViewingCuratorUsername(null);
        }}
        onSelectTheme={handleSelectTheme}
        onOpenCreatePost={() => {
          sound.playPop();
          setIsNewPostModalOpen(true);
        }}
      />
    </div>
  );
}
