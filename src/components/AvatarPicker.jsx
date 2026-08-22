import { AVATARS } from '../data/avatars';

export default function AvatarPicker({ value, onChange }) {
  return (
    <div className="avatar-picker">
      {AVATARS.map(a => (
        <button
          key={a.id}
          type="button"
          className={`avatar-option ${value === a.id ? 'selected' : ''}`}
          onClick={() => onChange(a.id)}
          title={a.name}
        >
          <img src={a.url} alt={a.name} />
        </button>
      ))}
    </div>
  );
}
