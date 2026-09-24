export interface Comment {
  id: string;
  username: string;
  userImg: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface CameraExif {
  camera?: string;
  lens?: string;
  iso?: number | string;
  aperture?: string;
  shutter?: string;
}

export type AppTheme = 'white-blue' | 'blue-black' | 'white-black';

export interface FilterSettings {
  brightness?: number; // 50 to 150 (default 100)
  contrast?: number;   // 50 to 180 (default 100)
  saturation?: number; // 0 to 200 (default 100)
  sepia?: number;      // 0 to 100 (default 0)
  blur?: number;       // 0 to 8 (default 0)
  hueRotate?: number;  // 0 to 360 (default 0)
}

export interface Post {
  id: string | number;
  userId: string;
  username: string;
  userImg: string;
  location?: string;
  postImg: string;
  caption: string;
  likes: number;
  isLiked: boolean;
  isSaved?: boolean;
  comments: Comment[];
  timestamp: string;
  isVerified?: boolean;
  filter?: string;
  filterSettings?: FilterSettings;
  exif?: CameraExif;
  tags?: string[];
}

export interface ReelItem {
  id: string;
  videoPoster: string;
  username: string;
  userImg: string;
  caption: string;
  song: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  commentsList?: { id: string; user: string; text: string }[];
}

export interface Story {
  id: string;
  username: string;
  userImg: string;
  mediaUrl: string;
  mediaType: 'image';
  hasUnseen: boolean;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  avatar: string;
  bio: string;
  website?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
  streakDays?: number;
  curatorLevel?: string;
  tags?: string[];
  joinedDate?: string;
  friends?: string[]; // Array of friend usernames
  themePreference?: AppTheme;
}

export interface UserAccount extends UserProfile {
  passwordHash?: string;
  savedPostIds: (string | number)[];
  likedPostIds: (string | number)[];
  followingUsernames: string[];
  friends: string[];
}

export interface DirectMessage {
  id: string;
  sender: 'user' | 'other';
  text: string;
  timestamp: string;
  sharedReel?: ReelItem;
  sharedPostId?: string | number;
}

export interface Conversation {
  id: string;
  username: string;
  fullName: string;
  userImg: string;
  lastMessage: string;
  timeAgo: string;
  unread: boolean;
  isFriend?: boolean;
  messages: DirectMessage[];
}

export interface AppNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'friend';
  username: string;
  userImg: string;
  postImg?: string;
  commentText?: string;
  timeAgo: string;
  read: boolean;
}
