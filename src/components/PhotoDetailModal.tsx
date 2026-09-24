import React, { useState } from 'react';
import { X, Heart, MessageCircle, Bookmark, Sparkles, Send, Sliders } from 'lucide-react';
import { Post } from '../types';
import { getPhotoFilterStyle } from '../utils/theme';

interface PhotoDetailModalProps {
  item: any;
  onClose: () => void;
  onToggleLike?: (id: any) => void;
  isLiked?: boolean;
  onEditPost?: (post: Post) => void;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  item,
  onClose,
  onToggleLike,
  isLiked = false,
  onEditPost,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<string[]>([
    'Remarkable lighting balance and tonal presence.',
  ]);
  const [likes, setLikes] = useState<number>(item?.likes || 420);
  const [liked, setLiked] = useState<boolean>(isLiked);

  if (!item) return null;

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikes((prev) => prev + 1);
    }
    onToggleLike?.(item.id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments([...comments, commentInput.trim()]);
    setCommentInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFCFB] border border-[#1A1A1A]/10 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Photo View */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
          <img
            src={item.img || item.postImg}
            alt={item.title || item.caption || 'Publication photo'}
            className="w-full h-full max-h-[70vh] object-contain"
            style={getPhotoFilterStyle(item.filter, item.filterSettings)}
          />
        </div>

        {/* Right Details */}
        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-[#1A1A1A]/10">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/10 mb-4">
              <div>
                <h3 className="font-serif-editorial text-xl font-light text-[#1A1A1A]">
                  {item.title || 'Curator Entry'}
                </h3>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#1A1A1A]/50">
                  @{item.author || item.username || 'curator'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onEditPost && (
                  <button
                    onClick={() => onEditPost(item)}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                    title="Edit visual filters & details"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-1 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {item.caption && (
              <p className="font-serif-editorial text-sm leading-relaxed text-[#1A1A1A]/80 mb-4">
                {item.caption}
              </p>
            )}

            {/* Comments Stream */}
            <div className="space-y-2 mt-4 max-h-48 overflow-y-auto pr-1">
              <span className="font-sans text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/40 block mb-2">
                Discussion Notes
              </span>
              {comments.map((c, i) => (
                <div key={i} className="text-xs font-sans p-2 bg-[#FAF9F6] border border-[#1A1A1A]/5">
                  <span className="font-bold text-[#1A1A1A] mr-1.5">@colleague</span>
                  <span className="text-[#1A1A1A]/80">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 font-sans text-xs font-bold text-[#1A1A1A]"
              >
                <Heart
                  className={`w-5 h-5 ${
                    liked ? 'fill-[#ed4956] text-[#ed4956]' : 'text-[#1A1A1A]'
                  }`}
                />
                <span>{likes.toLocaleString()} appreciations</span>
              </button>
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write critique..."
                className="flex-1 bg-[#FAF9F6] border border-[#1A1A1A]/15 px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#1A1A1A]"
              />
              <button
                type="submit"
                className="bg-[#1A1A1A] text-white px-3 py-2 text-xs font-sans uppercase tracking-widest font-bold hover:bg-black"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
