import { AVATARS } from '../data/avatars';

export default function Avatar({ avatarId, size = 32 }) {
  const avatar = AVATARS.find(a => a.id === avatarId);
  if (!avatar) return null;
  return (
    <img
      src={avatar.url}
      alt={avatar.name}
      title={avatar.name}
      className="avatar-img"
      style={{ width: size, height: size }}
    />
  );
}
