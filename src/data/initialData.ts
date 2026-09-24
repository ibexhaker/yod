import { Post, Story, UserProfile, Conversation, AppNotification } from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'user_current',
  username: 'you_the_creator',
  fullName: 'Alex Vance',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  bio: 'Visual story explorer & creative coder 📸✨ Building Snap Grid 🚀 Living between coffee shops & art galleries.',
  website: 'https://snapgrid.ai',
  postsCount: 12,
  followersCount: 4280,
  followingCount: 312,
  isVerified: true
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_self',
    username: 'Your Story',
    userImg: CURRENT_USER.avatar,
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1080&auto=format&fit=crop',
    mediaType: 'image',
    hasUnseen: false,
    timestamp: '2h ago'
  },
  {
    id: 'story_1',
    username: 'aurora_lens',
    userImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    mediaUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1080&auto=format&fit=crop',
    mediaType: 'image',
    hasUnseen: true,
    timestamp: '34m ago'
  },
  {
    id: 'story_2',
    username: 'atelier_nord',
    userImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1080&auto=format&fit=crop',
    mediaType: 'image',
    hasUnseen: true,
    timestamp: '1h ago'
  },
  {
    id: 'story_3',
    username: 'foodie_heaven',
    userImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1080&auto=format&fit=crop',
    mediaType: 'image',
    hasUnseen: true,
    timestamp: '3h ago'
  },
  {
    id: 'story_4',
    username: 'summit_views',
    userImg: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1080&auto=format&fit=crop',
    mediaType: 'image',
    hasUnseen: true,
    timestamp: '5h ago'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    userId: 'u1',
    username: 'aurora_lens',
    userImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    location: 'Lofoten, Norway',
    postImg: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800&auto=format&fit=crop',
    caption: 'Fjord shadows and aurora skies. 🌌 Long exposure captures the frozen night.',
    likes: 1245,
    isLiked: false,
    isSaved: false,
    isVerified: true,
    timestamp: '2 hours ago',
    comments: [
      {
        id: 'c1-1',
        username: 'atelier_nord',
        userImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
        text: 'The water clarity and emerald ribbon are unmatched! 😍',
        timestamp: '1h ago',
        likes: 14,
        isLiked: false
      }
    ]
  },
  {
    id: 'post-2',
    userId: 'u2',
    username: 'atelier_nord',
    userImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    location: 'Copenhagen, Denmark',
    postImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    caption: 'Quiet studio geometry. 🌿 Natural oak, linen textures, and late afternoon shadows.',
    likes: 892,
    isLiked: false,
    isSaved: false,
    isVerified: false,
    timestamp: '5 hours ago',
    comments: [
      {
        id: 'c2-1',
        username: 'foodie_heaven',
        userImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
        text: 'Clean lines and perfect natural ambient tones.',
        timestamp: '3h ago',
        likes: 5,
        isLiked: false
      }
    ]
  }
];

export const PRESET_IMAGE_GALLERY = [
  { id: '1', title: 'Coastal Sunrise', name: 'Coastal Sunrise', location: 'Amalfi Coast, Italy', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1080&auto=format&fit=crop', category: 'Nature' },
  { id: '2', title: 'Tokyo Neon Street', name: 'Tokyo Neon Street', location: 'Shinjuku, Tokyo', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1080&auto=format&fit=crop', category: 'City' },
  { id: '3', title: 'Alpine Peaks', name: 'Alpine Peaks', location: 'Zermatt, Switzerland', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1080&auto=format&fit=crop', category: 'Landscape' },
  { id: '4', title: 'Architectural Shadow', name: 'Architectural Shadow', location: 'Berlin, Germany', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1080&auto=format&fit=crop', category: 'Architecture' },
  { id: '5', title: 'Nordic Studio', name: 'Nordic Studio', location: 'Copenhagen, Denmark', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1080&auto=format&fit=crop', category: 'Interior' },
  { id: '6', title: 'Artisan Culinary', name: 'Artisan Culinary', location: 'Rome, Italy', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1080&auto=format&fit=crop', category: 'Food' },
];

export const EXPLORE_GRID = [
  { id: 'exp-1', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=500&auto=format&fit=crop', likes: '1.2k', comments: '45' },
  { id: 'exp-2', img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=500&auto=format&fit=crop', likes: '890', comments: '23' },
  { id: 'exp-3', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop', likes: '2.1k', comments: '98' },
  { id: 'exp-4', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500&auto=format&fit=crop', likes: '450', comments: '12' },
  { id: 'exp-5', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500&auto=format&fit=crop', likes: '3.4k', comments: '112' },
  { id: 'exp-6', img: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=500&auto=format&fit=crop', likes: '980', comments: '41' },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    username: 'aurora_lens',
    fullName: 'Astrid Lind',
    userImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    lastMessage: 'Welcome to Snap Grid! Feel free to share your shots or send shorts here.',
    timeAgo: '15m',
    unread: false,
    messages: [
      { id: 'm1', sender: 'other', text: 'Welcome to Snap Grid! Feel free to share your shots or send shorts here.', timestamp: '10:30 AM' }
    ]
  },
  {
    id: 'conv_2',
    username: 'foodie_heaven',
    fullName: 'Lucas Rossi',
    userImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    lastMessage: 'Great connection! Excited to see your portfolio.',
    timeAgo: '1d',
    unread: false,
    messages: [
      { id: 'm31', sender: 'other', text: 'Great connection! Excited to see your portfolio.', timestamp: 'Yesterday' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'like',
    username: 'aurora_lens',
    userImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    postImg: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=200&auto=format&fit=crop',
    timeAgo: '5m ago',
    read: false
  },
];
