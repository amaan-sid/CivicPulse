import { useState } from "react"

export const DEFAULT_MALE_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="bgM" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2338bdf8"/><stop offset="100%" stop-color="%230284c7"/></linearGradient><linearGradient id="skinM" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fed7aa"/><stop offset="100%" stop-color="%23fb923c"/></linearGradient><linearGradient id="hairM" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23334155"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><linearGradient id="shirtM" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f1f5f9"/><stop offset="100%" stop-color="%23cbd5e1"/></linearGradient></defs><circle cx="64" cy="64" r="64" fill="url(%23bgM)"/><path d="M64 94 C44 94 25 105 16 122 C29 135 46 142 64 142 C82 142 99 135 112 122 C103 105 84 94 64 94 Z" fill="url(%23shirtM)"/><path d="M55 83 L73 83 L70 95 L58 95 Z" fill="%23f97316" opacity="0.3"/><circle cx="64" cy="60" r="23" fill="url(%23skinM)"/><path d="M41 53 C41 39 50 32 64 32 C78 32 87 39 87 53 C87 56 86 62 86 62 C84 56 80 49 72 48 C64 47 57 50 51 48 C46 46 43 56 42 62 C42 62 41 55 41 53 Z" fill="url(%23hairM)"/></svg>`

export const DEFAULT_FEMALE_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="bgF" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f472b6"/><stop offset="100%" stop-color="%23db2777"/></linearGradient><linearGradient id="skinF" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fed7aa"/><stop offset="100%" stop-color="%23fb923c"/></linearGradient><linearGradient id="hairF" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%234a044e"/><stop offset="100%" stop-color="%232e1065"/></linearGradient><linearGradient id="shirtF" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fdf2f8"/><stop offset="100%" stop-color="%23fbcfe8"/></linearGradient></defs><circle cx="64" cy="64" r="64" fill="url(%23bgF)"/><path d="M35 48 C35 74 38 88 42 96 C44 88 46 70 46 62 C46 54 47 48 47 48 Z" fill="url(%23hairF)"/><path d="M93 48 C93 74 90 88 86 96 C84 88 82 70 82 62 C82 54 81 48 81 48 Z" fill="url(%23hairF)"/><path d="M64 94 C44 94 25 105 16 122 C29 135 46 142 64 142 C82 142 99 135 112 122 C103 105 84 94 64 94 Z" fill="url(%23shirtF)"/><path d="M55 83 L73 83 L70 95 L58 95 Z" fill="%23f97316" opacity="0.3"/><circle cx="64" cy="60" r="22" fill="url(%23skinF)"/><path d="M42 53 C42 37 52 31 64 31 C76 31 86 37 86 53 C86 53 84 45 76 45 C67 45 65 51 57 47 C51 44 44 47 42 53 Z" fill="url(%23hairF)"/><ellipse cx="64" cy="32" rx="20" ry="7" fill="%23581c87"/></svg>`

export function getDefaultAvatar(gender?: string): string {
  if (gender === "female") {
    return DEFAULT_FEMALE_AVATAR
  }
  return DEFAULT_MALE_AVATAR
}

export function getUserAvatarSrc(user?: { profilePic?: string; gender?: string } | null): string {
  if (user?.profilePic && user.profilePic.trim()) {
    return user.profilePic
  }
  return getDefaultAvatar(user?.gender)
}

interface UserAvatarProps {
  src?: string | null
  gender?: "male" | "female" | string
  name?: string
  className?: string
  alt?: string
}

export default function UserAvatar({
  src,
  gender = "male",
  name = "User",
  className = "w-10 h-10 rounded-full",
  alt,
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false)

  const defaultAvatar = getDefaultAvatar(gender)
  const imageSource = !hasError && src && src.trim() ? src : defaultAvatar

  return (
    <img
      src={imageSource}
      alt={alt || name}
      onError={() => setHasError(true)}
      className={`object-cover shrink-0 select-none ${className}`}
    />
  )
}
