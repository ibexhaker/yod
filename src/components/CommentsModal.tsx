import React, { useState } from 'react';
import { X, Heart, Send, Smile } from 'lucide-react';
import { Post, Comment } from '../types';

interface CommentsModalProps {
  post: Post | null;
  onClose: () => void;
  onAddComment: (postId: string | number, text: string) => void;
  onToggleCommentLike: (postId: string | number, commentId: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  post,
  onClose,
  onAddComment,
  onToggleCommentLike,
}) => {
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] h-[600px] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Modal Handlebar (Mobile) & Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50/80">
          <div className="w-8" />
          <h3 className="text-sm font-bold text-neutral-900">Comments</h3>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Caption as first comment item */}
        <div className="p-4 border-b border-neutral-100 flex items-start gap-3 bg-neutral-50/30">
          <img
            src={post.userImg}
            alt={post.username}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-200 flex-shrink-0"
          />
          <div className="flex-1 text-xs">
            <div className="leading-relaxed">
              <span className="font-semibold text-neutral-900 mr-1.5">{post.username}</span>
              <span className="text-neutral-800">{post.caption}</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-1">{post.timestamp}</div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {post.comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <p className="text-sm font-semibold text-neutral-700 mb-1">No comments yet</p>
              <p className="text-xs">Start the conversation with your thoughts!</p>
            </div>
          ) : (
            post.comments.map((comment: Comment) => (
              <div key={comment.id} className="flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-3 flex-1">
                  <img
                    src={comment.userImg}
                    alt={comment.username}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-200 flex-shrink-0"
                  />
                  <div className="flex-1 text-xs">
                    <div className="leading-snug">
                      <span className="font-semibold text-neutral-900 mr-1.5 hover:underline cursor-pointer">
                        {comment.username}
                      </span>
                      <span className="text-neutral-800">{comment.text}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1">
                      <span>{comment.timestamp}</span>
                      {comment.likes > 0 && (
                        <span className="font-medium text-neutral-600">
                          {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                        </span>
                      )}
                      <button
                        onClick={() => setCommentText(`@${comment.username} `)}
                        className="font-medium hover:text-neutral-900 cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comment Like Button */}
                <button
                  onClick={() => onToggleCommentLike(post.id, comment.id)}
                  className="p-1 text-neutral-400 hover:text-rose-500 transition-colors flex-shrink-0"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      comment.isLiked ? 'text-rose-500 fill-rose-500' : 'text-neutral-400'
                    }`}
                  />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Emoji Suggestions bar */}
        <div className="flex items-center gap-2 px-4 py-1.5 border-t border-neutral-100 bg-neutral-50/50 overflow-x-auto no-scrollbar">
          {['❤️', '🙌', '🔥', '👏', '😍', '😮', '😂', '💯'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmoji(emoji)}
              className="text-base hover:scale-125 transition-transform p-0.5"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Comment Composer */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-neutral-200 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a comment as Alex Vance..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 text-xs text-neutral-800 placeholder-neutral-400 bg-neutral-100 focus:bg-white border border-transparent focus:border-rose-400 rounded-full px-4 py-2 outline-none transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2 text-rose-600 hover:text-rose-700 disabled:opacity-40 disabled:hover:text-rose-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
