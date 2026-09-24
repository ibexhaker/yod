import React, { useState } from 'react';
import { SnapGridLogo } from './SnapGridLogo';
import { UserAccount, AppTheme } from '../types';
import { DEFAULT_ACCOUNTS } from '../data';
import { THEMES } from '../utils/theme';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Camera,
  Upload,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  ShieldCheck,
  User,
  Heart,
  Image as ImageIcon,
} from 'lucide-react';

interface AuthModalProps {
  onLoginSuccess: (account: UserAccount) => void;
  existingAccounts: UserAccount[];
}

const PRESET_AVATARS = [
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    label: 'Cora / Editorial',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    label: 'Lucas / Street',
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    label: 'Sophia / Portrait',
  },
  {
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    label: 'Soren / Analog',
  },
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    label: 'Astrid / Nordic',
  },
  {
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    label: 'Liam / Brutalism',
  },
];

const VIBE_TAGS = [
  '#minimalism',
  '#street',
  '#architecture',
  '#cinematic',
  '#goldenhour',
  '#35mm',
  '#monochrome',
  '#editorial',
  '#coastal',
  '#portrait',
];

const BIO_SUGGESTIONS = [
  'Exploring spatial silence, architectural brutalism, and soft daylight.',
  'Capturing 35mm street rhythm, neon reflections, and fleeting glances.',
  'Visual curator obsessed with tonal gradients and medium-format textures.',
  'Finding poetry in ordinary geometries, sea mist, and Mediterranean sun.',
];

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, existingAccounts }) => {
  const [tab, setTab] = useState<'signup' | 'signin'>('signup');

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);
  const [bio, setBio] = useState(BIO_SUGGESTIONS[0]);
  const [website, setWebsite] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#minimalism', '#editorial']);
  const [selectedTheme, setSelectedTheme] = useState<AppTheme>('white-blue');
  const [errorMsg, setErrorMsg] = useState('');

  // Sign in fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleToggleTag = (tag: string) => {
    sound.playPop();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 4) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
          sound.playCameraShutter();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!username.trim()) {
      setErrorMsg('Please choose a curator handle.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (cleanUsername.length < 3) {
      setErrorMsg('Username must be at least 3 characters (letters, numbers, underscores).');
      return;
    }

    // Check if username taken in existing accounts
    const usernameTaken = existingAccounts.some(
      (acc) => acc.username.toLowerCase() === cleanUsername
    );
    if (usernameTaken) {
      setErrorMsg(`@${cleanUsername} is already taken. Try adding numbers or initials.`);
      return;
    }

    const newAccount: UserAccount = {
      id: `user_${Date.now()}`,
      username: cleanUsername,
      fullName: fullName.trim(),
      email: email.trim() || `${cleanUsername}@snapgrid.studio`,
      avatar: avatar || PRESET_AVATARS[0].url,
      bio: bio.trim() || 'Curator on Snap Grid.',
      website: website.trim() ? website.trim() : undefined,
      postsCount: 0,
      followersCount: 1,
      followingCount: 3,
      isVerified: true,
      streakDays: 1,
      curatorLevel: 'Founding Curator',
      tags: selectedTags,
      joinedDate: 'Joined Just Now',
      savedPostIds: [],
      likedPostIds: [],
      followingUsernames: ['aurora_lens', 'atelier_nord'],
      friends: ['aurora_lens'],
      themePreference: selectedTheme,
    };

    sound.playCameraShutter();
    onLoginSuccess(newAccount);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const query = loginIdentifier.trim().toLowerCase().replace('@', '');
    if (!query) {
      setErrorMsg('Please enter your username or email.');
      return;
    }

    const found = existingAccounts.find(
      (acc) =>
        acc.username.toLowerCase() === query ||
        (acc.email && acc.email.toLowerCase() === query)
    );

    if (found) {
      sound.playLikeChime();
      onLoginSuccess(found);
    } else {
      // If not found in loaded accounts, allow quick creation or helpful hint
      setErrorMsg(`No account found for "${loginIdentifier}". Try signing up or pick a Demo Curator below!`);
    }
  };

  const handleSelectDemoAccount = (demo: UserAccount) => {
    sound.playLikeChime();
    onLoginSuccess(demo);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0E0E0E]/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#FDFCFB] text-[#1A1A1A] w-full max-w-4xl border border-[#1A1A1A]/15 shadow-2xl rounded-2xl overflow-hidden my-auto flex flex-col md:flex-row max-h-[92vh]">
        {/* Left Side: Brand Visual Showcase */}
        <div className="w-full md:w-5/12 bg-black text-white p-8 flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-40 mix-blend-luminosity bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/95 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white text-black p-2 rounded-xl flex items-center justify-center shadow-lg">
                <SnapGridLogo variant="icon" theme="light" size={32} />
              </div>
              <div>
                <span className="font-sans font-black tracking-[0.25em] text-lg uppercase text-white block">
                  SNAP GRID
                </span>
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/60">
                  Curator Platform
                </span>
              </div>
            </div>

            <div className="pt-6">
              <h2 className="text-3xl lg:text-4xl font-serif-editorial font-light tracking-tight text-white leading-tight">
                Where Pure <span className="italic font-normal">Vision</span> Finds Its Frame.
              </h2>
              <p className="font-sans text-xs text-white/70 mt-3 leading-relaxed">
                Join our private editorial gallery. Share monographs, explore fine art photography, and curate your visual portfolio.
              </p>
            </div>
          </div>

          {/* Community Badges / Highlights */}
          <div className="relative z-10 pt-8 space-y-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider">
                  Verified Curator Network
                </span>
              </div>
              <p className="font-sans text-[10px] text-white/70">
                Every member has a distinct portfolio, camera EXIF tracking, and high-fidelity monographs.
              </p>
            </div>

            {/* Quick Demo Curators Bar */}
            <div>
              <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-white/50 block mb-2 font-bold">
                Instant Demo Access:
              </span>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectDemoAccount(acc)}
                    className="flex items-center gap-2 bg-white/15 hover:bg-white/30 border border-white/20 px-2.5 py-1.5 rounded-lg text-left transition-all text-white group"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.username}
                      className="w-5 h-5 rounded-full object-cover border border-white/40"
                    />
                    <span className="font-sans text-[10px] font-medium group-hover:underline">
                      @{acc.username}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Account Forms */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-[#FDFCFB]">
          <div>
            {/* Tab switch header */}
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setTab('signup');
                    setErrorMsg('');
                    sound.playPop();
                  }}
                  className={`font-sans text-xs uppercase tracking-[0.2em] font-bold pb-1 transition-all ${
                    tab === 'signup'
                      ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A]'
                      : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('signin');
                    setErrorMsg('');
                    sound.playPop();
                  }}
                  className={`font-sans text-xs uppercase tracking-[0.2em] font-bold pb-1 transition-all ${
                    tab === 'signin'
                      ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A]'
                      : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
                  }`}
                >
                  Sign In
                </button>
              </div>

              <span className="font-serif-editorial italic text-xs text-[#1A1A1A]/50">
                {tab === 'signup' ? 'Step inside the grid' : 'Welcome back'}
              </span>
            </div>

            {errorMsg && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {tab === 'signup' ? (
              /* Sign Up Form */
              <form onSubmit={handleSignUpSubmit} className="space-y-5">
                {/* Full Name & Username */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Lin"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (!username && e.target.value) {
                          setUsername(
                            e.target.value
                              .toLowerCase()
                              .trim()
                              .replace(/\s+/g, '_')
                              .replace(/[^a-z0-9_]/g, '')
                          );
                        }
                      }}
                      className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-lg px-3.5 py-2 text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 block mb-1">
                      Curator Handle *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-[#1A1A1A]/40 font-mono">
                        @
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="maya_lin"
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                        }
                        className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-lg pl-7 pr-3 py-2 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="maya@photostudio.art"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-lg px-3.5 py-2 text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 block mb-1">
                      Passcode
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-lg px-3.5 py-2 text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70">
                      Curator Avatar
                    </label>
                    <label className="text-[10px] font-sans text-[#1A1A1A] underline cursor-pointer hover:opacity-70 flex items-center gap-1 font-semibold">
                      <Upload className="w-3 h-3" />
                      <span>Upload Custom Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => {
                          setAvatar(p.url);
                          sound.playPop();
                        }}
                        className={`relative w-12 h-12 rounded-full p-[2px] shrink-0 transition-transform ${
                          avatar === p.url
                            ? 'ring-2 ring-[#1A1A1A] scale-110'
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                        title={p.label}
                      >
                        <img
                          src={p.url}
                          alt={p.label}
                          className="w-full h-full rounded-full object-cover"
                        />
                        {avatar === p.url && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio & Click-to-Fill Inspiration */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70">
                      Curator Statement / Bio
                    </label>
                    <span className="font-sans text-[9px] text-[#1A1A1A]/40 uppercase tracking-wider">
                      Tap inspiration below
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your photographic lens, geometry, or philosophy..."
                    className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-lg px-3.5 py-2 text-xs font-serif-editorial text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {BIO_SUGGESTIONS.slice(0, 2).map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setBio(sug);
                          sound.playPop();
                        }}
                        className="text-[9px] font-sans text-[#1A1A1A]/60 bg-white border border-[#1A1A1A]/10 px-2 py-0.5 rounded hover:border-[#1A1A1A] transition-colors truncate max-w-[280px]"
                      >
                        "{sug.slice(0, 35)}..."
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aesthetic Tags */}
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 block mb-1.5">
                    Aesthetic Tags ({selectedTags.length}/4)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {VIBE_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`text-[10px] font-sans uppercase tracking-wider px-2.5 py-1 rounded-full transition-all ${
                            isSelected
                              ? 'bg-[#1A1A1A] text-white font-bold'
                              : 'bg-white text-[#1A1A1A]/60 border border-[#1A1A1A]/15 hover:border-[#1A1A1A]'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Theme Preference Choice (White & Blue, Blue & Black, White & Black) */}
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 flex items-center justify-between mb-1.5">
                    <span>Choose Your Visual Palette</span>
                    <span className="text-blue-600 font-bold">{THEMES.find((t) => t.id === selectedTheme)?.name}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {THEMES.map((th) => {
                      const isSelected = selectedTheme === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => {
                            sound.playPop();
                            setSelectedTheme(th.id);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all relative ${
                            isSelected
                              ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm bg-blue-50/40'
                              : 'border-black/10 hover:border-black/30 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full ${th.previewAccent} border border-black/10`} />
                            <div className={`w-3.5 h-3.5 rounded-full ${th.previewBg} border border-black/20`} />
                          </div>
                          <span className="font-sans text-[11px] font-bold block truncate text-[#1A1A1A]">
                            {th.name}
                          </span>
                          <span className="text-[9px] text-neutral-500 font-sans block line-clamp-1">
                            {th.id === 'white-blue' ? 'Default' : th.id === 'blue-black' ? 'Darkroom' : 'Monochrome'}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01]"
                  >
                    <span>Create Account & Enter Snap Grid</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Sign In Form */
              <form onSubmit={handleSignInSubmit} className="space-y-5">
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 block mb-1">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@julian_vance or julian@snapgrid.studio"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-lg px-3.5 py-2.5 text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 block mb-1">
                    Passcode
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-lg px-3.5 py-2.5 text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01]"
                  >
                    <span>Sign In to Portfolio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Existing Accounts List */}
                <div className="pt-4 border-t border-[#1A1A1A]/10">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[#1A1A1A]/50 block mb-3 font-semibold">
                    Saved Curators On This Machine:
                  </span>
                  <div className="space-y-2">
                    {existingAccounts.map((acc) => (
                      <div
                        key={acc.id}
                        onClick={() => handleSelectDemoAccount(acc)}
                        className="flex items-center justify-between p-2.5 bg-[#FAF9F6] hover:bg-white border border-[#1A1A1A]/10 rounded-xl cursor-pointer transition-all hover:border-[#1A1A1A] group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={acc.avatar}
                            alt={acc.username}
                            className="w-9 h-9 rounded-full object-cover border border-[#1A1A1A]/20"
                          />
                          <div>
                            <span className="font-sans text-xs font-bold text-[#1A1A1A] block group-hover:underline">
                              {acc.fullName}
                            </span>
                            <span className="font-sans text-[10px] text-[#1A1A1A]/50">
                              @{acc.username} • {acc.curatorLevel || 'Curator'}
                            </span>
                          </div>
                        </div>
                        <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] bg-white border border-[#1A1A1A]/20 px-3 py-1 rounded-full group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                          Resume
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between text-[#1A1A1A]/40 text-[10px] font-sans uppercase tracking-widest">
            <span>Snap Grid v2.5 • Fine Art Social</span>
            <span>Zero Slop • High Fidelity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
