import { Play } from 'lucide-react';

interface VideoPlaceholderProps {
  poster: string;
  name: string;
}

export function VideoPlaceholder({ poster, name }: VideoPlaceholderProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-900">
      <img
        src={poster}
        alt=""
        className="h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 grid place-items-center">
        <button
          type="button"
          aria-label={`Play intro video of ${name}`}
          className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-brand-600 shadow-lg transition-transform hover:scale-105"
        >
          <Play className="h-7 w-7 translate-x-0.5 fill-current" />
        </button>
      </div>
      <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
        Intro video · {name}
      </span>
    </div>
  );
}
