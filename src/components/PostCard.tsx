import React, { useState } from 'react';
import { Post, Comment } from '../types';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  CheckCircle2,
  Sparkles,
  Camera,
  UserPlus,
  UserCheck,
  Sliders,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { getPhotoFilterStyle } from '../utils/theme';

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

interface PostCardProps {
  post: Post;
  currentUsername?: string;
  isFollowing?: boolean;
  onToggleFollow?: (username: string) => void;
  onToggleLike: (postId: string | number) => void;
  onToggleSave: (postId: string | number) => void;
  onAddComment: (postId: string | number, text: string) => void;
  onOpenShareModal: (post: Post) => void;
  onSelectUser?: (username: string) => void;
  onEditPost?: (post: Post) => void;
}

const REACTION_EMOJIS = ['❤️', '🔥', '✨', '📸', '😍', '👏'];

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUsername,
  isFollowing = false,
  onToggleFollow,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onOpenShareModal,
  onSelectUser,
  onEditPost,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [lastTap, setLastTap] = useState(0);
  const [showExifDetails, setShowExifDetails] = useState(false);

  const triggerFloatingEmoji = (emoji: string) => {
    sound.playLikeChime();
    const id = Date.now() + Math.random();
    const randomX = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    setFloatingEmojis((prev) => [...prev, { id, emoji, x: randomX }]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        onToggleLike(post.id);
        sound.playLikeChime();
      }
      setShowHeartBurst(true);
      triggerFloatingEmoji('❤️');
      setTimeout(() => setShowHeartBurst(false), 800);
    }
    setLastTap(now);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    sound.playPop();
    onAddComment(post.id, commentText.trim());
    setCommentText('');
    setShowAllComments(true);
  };

  const handleLikeClick = () => {
    sound.playLikeChime();
    onToggleLike(post.id);
    if (!post.isLiked) {
      triggerFloatingEmoji('❤️');
    }
  };

  const handleSaveClick = () => {
    sound.playBookmark();
    onToggleSave(post.id);
  };

  const getFilterClass = (filterName?: string) => {
    switch (filterName) {
      case 'grayscale':
        return 'grayscale contrast-110';
      case 'sepia':
        return 'sepia-[0.4] contrast-105 brightness-95';
      case 'vivid':
        return 'saturate-150 contrast-110';
      case 'warm':
        return 'sepia-[0.2] saturate-125';
      default:
        return '';
    }
  };

  const isSelf = currentUsername && currentUsername.toLowerCase() === post.username.toLowerCase();

  return (
    <article
      id={`post-${post.id}`}
      className="bg-white border border-[#1A1A1A]/10 rounded-xl mb-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:border-[#1A1A1A]/20 relative"
    >
      {/* Floating Emojis Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {floatingEmojis.map((item) => (
          <span
            key={item.id}
            className="absolute bottom-16 text-3xl animate-float-up select-none"
            style={{ left: `${item.x}%` }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Post Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1A1A1A]/5">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectUser?.(post.username)}
          >
            <div className="relative">
              <img
                src={post.userImg}
                alt={post.username}
                className="w-9 h-9 rounded-full object-cover border border-[#1A1A1A]/10 p-[1px] group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-xs font-bold tracking-wide text-[#1A1A1A] group-hover:underline">
                  {post.username}
                </span>
                {post.isVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A] fill-[#1A1A1A] text-white" />
                )}
              </div>
              {post.location && (
                <p className="font-sans text-[10px] text-[#1A1A1A]/50 tracking-wider">
                  {post.location}
                </p>
              )}
            </div>
          </div>

          {/* Follow Button for non-self authors */}
          {!isSelf && onToggleFollow && (
            <button
              onClick={() => {
                sound.playPop();
                onToggleFollow(post.username);
              }}
              className={`ml-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold tracking-wider uppercase transition-all flex items-center gap-1 ${
                isFollowing
                  ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-2.5 h-2.5" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-2.5 h-2.5" />
                  <span>Follow</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onEditPost && (
            <button
              onClick={() => {
                sound.playPop();
                onEditPost(post);
              }}
              className="px-2 py-1 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider bg-neutral-100 hover:bg-blue-50 text-neutral-700 hover:text-blue-600 transition-colors flex items-center gap-1 border border-black/5"
              title="Edit visual filters, darkroom curves & details"
            >
              <Sliders className="w-3 h-3 text-blue-600" />
              <span>Edit</span>
            </button>
          )}
          {post.exif && (
            <button
              onClick={() => setShowExifDetails(!showExifDetails)}
              className="p-1 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-neutral-100 transition-colors"
              title="Camera EXIF Info"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#1A1A1A]/40">
            {post.timestamp}
          </span>
          <button
            id={`post-options-btn-${post.id}`}
            aria-label="Post options"
            onClick={() => {
              if (onEditPost) {
                sound.playPop();
                onEditPost(post);
              }
            }}
            className="p-1.5 text-[#1A1A1A]/40 hover:text-[#1A1A1A] rounded-full hover:bg-neutral-100 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* EXIF Metadata Drawer if toggled */}
      {showExifDetails && post.exif && (
        <div className="bg-[#1A1A1A] text-white px-5 py-2.5 text-[11px] font-mono flex items-center justify-between border-b border-[#1A1A1A]/20">
          <div className="flex items-center gap-3">
            <span className="font-bold">{post.exif.camera}</span>
            <span>•</span>
            <span>{post.exif.lens}</span>
          </div>
          <div className="flex items-center gap-3 opacity-70">
            <span>{post.exif.aperture}</span>
            <span>{post.exif.shutter}</span>
            <span>ISO {post.exif.iso}</span>
          </div>
        </div>
      )}

      {/* Post Image Container with Double Tap Animation */}
      <div
        className="relative bg-[#F5F5F5] overflow-hidden select-none cursor-pointer group"
        onClick={handleDoubleTap}
      >
        <img
          src={post.postImg}
          alt={post.caption}
          className={`w-full max-h-[580px] object-cover transition-transform duration-700 group-hover:scale-[1.01] ${getFilterClass(
            post.filter
          )}`}
          style={getPhotoFilterStyle(post.filter, post.filterSettings)}
          loading="lazy"
        />

        {/* Double-tap floating heart burst */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="animate-heart-burst drop-shadow-xl bg-white/90 backdrop-blur-sm p-5 rounded-full">
              <Heart className="w-14 h-14 fill-[#ed4956] text-[#ed4956]" />
            </div>
          </div>
        )}

        {/* Filter Indicator Badge if active */}
        {post.filter && post.filter !== 'none' && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-0.5 text-[9px] font-sans uppercase tracking-widest rounded-full flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{post.filter}</span>
          </div>
        )}
      </div>

      {/* Post Actions & Lovable Quick Reactions Bar */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              id={`like-btn-${post.id}`}
              onClick={handleLikeClick}
              className="flex items-center gap-1.5 group transition-transform active:scale-90"
              aria-label={post.isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  post.isLiked
                    ? 'fill-[#ed4956] text-[#ed4956]'
                    : 'text-[#1A1A1A] group-hover:text-neutral-600'
                }`}
              />
            </button>

            <button
              id={`comment-btn-${post.id}`}
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-[#1A1A1A] hover:text-neutral-600 transition-colors"
              aria-label="Comments"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            <button
              id={`share-btn-${post.id}`}
              onClick={() => onOpenShareModal(post)}
              className="text-[#1A1A1A] hover:text-neutral-600 transition-colors"
              aria-label="Share"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Lovable Emojis Blast Bar */}
          <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#1A1A1A]/10 px-2 py-1 rounded-full">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => triggerFloatingEmoji(emoji)}
                className="text-xs hover:scale-125 transition-transform p-0.5"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            id={`save-btn-${post.id}`}
            onClick={handleSaveClick}
            className="text-[#1A1A1A] hover:text-neutral-600 transition-colors"
            aria-label={post.isSaved ? 'Remove Bookmark' : 'Bookmark Post'}
          >
            <Bookmark
              className={`w-5 h-5 ${
                post.isSaved
                  ? 'fill-[#1A1A1A] text-[#1A1A1A]'
                  : 'text-[#1A1A1A]'
              }`}
            />
          </button>
        </div>

        {/* Likes Count in Editorial Typography */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-sans text-xs font-bold tracking-tight text-[#1A1A1A]">
            {post.likes.toLocaleString()} <span className="font-normal opacity-70">appreciations</span>
          </span>
          {post.isLiked && (
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#ed4956] font-semibold">
              Appreciated by you
            </span>
          )}
        </div>

        {/* Caption */}
        <div className="font-serif-editorial text-sm md:text-[15px] leading-relaxed text-[#1A1A1A] mb-3">
          <span
            className="font-sans font-bold text-xs tracking-wide mr-2 font-sans-editorial cursor-pointer hover:underline"
            onClick={() => onSelectUser?.(post.username)}
          >
            {post.username}
          </span>
          {post.caption}
        </div>

        {/* Tags if present */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-sans text-[10px] text-[#1A1A1A]/60 bg-[#FAF9F6] border border-[#1A1A1A]/10 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Preview / List */}
        {post.comments.length > 0 && (
          <div className="mt-2 pt-2 border-t border-[#1A1A1A]/5 space-y-2">
            {!showAllComments && post.comments.length > 2 && (
              <button
                id={`view-comments-btn-${post.id}`}
                onClick={() => setShowAllComments(true)}
                className="font-sans text-[11px] uppercase tracking-wider text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors block text-left"
              >
                View all {post.comments.length} discussions
              </button>
            )}

            {(showAllComments ? post.comments : post.comments.slice(0, 2)).map((comment: Comment) => (
              <div key={comment.id} className="flex items-start justify-between text-xs leading-normal">
                <div className="pr-4">
                  <span className="font-sans font-bold text-[11px] mr-1.5 text-[#1A1A1A]">
                    {comment.username}
                  </span>
                  <span className="text-[#1A1A1A]/80 font-sans text-xs">{comment.text}</span>
                  <span className="ml-2 font-sans text-[9px] text-[#1A1A1A]/40">{comment.timestamp}</span>
                </div>
                <button
                  aria-label="Like comment"
                  onClick={() => sound.playLikeChime()}
                  className="text-[#1A1A1A]/30 hover:text-[#ed4956] transition-colors shrink-0"
                >
                  <Heart className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment Input */}
        <form onSubmit={handleCommentSubmit} className="mt-3.5 pt-3 border-t border-[#1A1A1A]/10 flex items-center gap-2">
          <input
            id={`comment-input-${post.id}`}
            type="text"
            placeholder="Add an editorial critique or comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-transparent font-sans text-xs text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none"
          />
          {commentText.trim() && (
            <button
              id={`submit-comment-btn-${post.id}`}
              type="submit"
              className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#1A1A1A] hover:opacity-70 transition-opacity"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};
