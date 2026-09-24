import React from 'react';
import { X, Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-md h-[550px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-neutral-900">Notifications</h3>
            {notifications.some((n) => !n.read) && (
              <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900"
            >
              Mark read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-50 p-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                !notif.read ? 'bg-rose-50/40' : 'hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                  <img
                    src={notif.userImg}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-200"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                    {notif.type === 'like' && <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />}
                    {notif.type === 'comment' && <MessageCircle className="w-3 h-3 text-blue-500 fill-blue-500" />}
                    {notif.type === 'follow' && <UserPlus className="w-3 h-3 text-emerald-500" />}
                  </div>
                </div>

                <div className="text-xs text-neutral-800 flex-1 leading-snug">
                  <span className="font-semibold text-neutral-900 mr-1">{notif.username}</span>
                  {notif.type === 'like' && 'liked your photo.'}
                  {notif.type === 'comment' && `commented: "${notif.commentText}"`}
                  {notif.type === 'follow' && 'started following you.'}
                  <div className="text-[10px] text-neutral-400 mt-0.5">{notif.timeAgo}</div>
                </div>
              </div>

              {notif.postImg && (
                <img
                  src={notif.postImg}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-neutral-200 flex-shrink-0"
                />
              )}

              {notif.type === 'follow' && (
                <button className="text-[11px] font-semibold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1 rounded-lg transition-colors">
                  Follow
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
