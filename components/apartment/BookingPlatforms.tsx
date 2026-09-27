import { cn } from "@/lib/utils";

interface Props {
  airbnbUrl?: string | null;
  bookingUrl?: string | null;
  className?: string;
}

function AirbnbLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.996 0C5.372 0 0 5.372 0 12s5.372 12 11.996 12C18.627 24 24 18.628 24 12S18.627 0 11.996 0zm.004 4.29c.907 0 1.642.735 1.642 1.641 0 .907-.735 1.643-1.642 1.643-.906 0-1.641-.736-1.641-1.643 0-.906.735-1.641 1.641-1.641zm4.372 11.653c-.195.43-.482.808-.84 1.1-.36.29-.784.492-1.236.584-.227.047-.458.07-.69.07-.43 0-.857-.083-1.26-.243l-.346-.134-.346.134c-.403.16-.83.243-1.26.243-.232 0-.463-.023-.69-.07-.452-.092-.876-.294-1.236-.584-.358-.292-.645-.67-.84-1.1-.474-1.054-.192-2.237.28-3.337l2.092-4.738c.09-.203.29-.335.517-.335h.966c.227 0 .427.132.517.335l2.092 4.738c.472 1.1.754 2.283.28 3.337z" />
    </svg>
  );
}

function BookingLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.5 0h-15A4.5 4.5 0 0 0 0 4.5v15A4.5 4.5 0 0 0 4.5 24h15a4.5 4.5 0 0 0 4.5-4.5v-15A4.5 4.5 0 0 0 19.5 0zM9.4 16.9H7V7.1h2.4v9.8zm4.8 0h-2.4V7.1H14c2.2 0 3.6 1.3 3.6 3.3 0 1.4-.7 2.5-1.9 3l2.2 3.5h-2.7l-1.9-3.2h-.1v3.2zm0-5h-.1V9h.2c.9 0 1.4.5 1.4 1.4 0 1-.5 1.5-1.5 1.5z" />
    </svg>
  );
}

export function BookingPlatforms({ airbnbUrl, bookingUrl, className }: Props) {
  if (!airbnbUrl && !bookingUrl) return null;

  return (
    <div className={cn("space-y-2.5", className)}>
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45 font-medium mb-3">
        Auch buchbar auf
      </p>
      {airbnbUrl && (
        <a
          href={airbnbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full border border-ink/12 bg-parchment/60 px-4 py-3 rounded-sm hover:border-ink/25 hover:bg-parchment transition-all duration-200 group text-sm"
        >
          <span className="flex items-center gap-3 text-[#FF5A5F]">
            <AirbnbLogo />
            <span className="font-medium text-ink">Airbnb</span>
          </span>
          <span className="text-ink/30 group-hover:text-ink/60 group-hover:translate-x-0.5 transition-all duration-200 text-xs">
            ↗
          </span>
        </a>
      )}
      {bookingUrl && (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full border border-ink/12 bg-parchment/60 px-4 py-3 rounded-sm hover:border-ink/25 hover:bg-parchment transition-all duration-200 group text-sm"
        >
          <span className="flex items-center gap-3 text-[#003580]">
            <BookingLogo />
            <span className="font-medium text-ink">Booking.com</span>
          </span>
          <span className="text-ink/30 group-hover:text-ink/60 group-hover:translate-x-0.5 transition-all duration-200 text-xs">
            ↗
          </span>
        </a>
      )}
    </div>
  );
}
