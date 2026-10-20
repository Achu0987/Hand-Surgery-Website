import Link from "next/link";

// Thumb-reachable actions for one-handed phone use.
export default function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-indigo-900/10 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(18,19,61,0.12)] backdrop-blur sm:hidden">
      <div className="grid grid-cols-2 gap-2">
        <Link href="/contact#call" className="flex min-h-12 items-center justify-center rounded-full font-bold text-indigo-900 ring-1 ring-indigo-900/25">
          Call the office
        </Link>
        <Link href="/contact" className="flex min-h-12 items-center justify-center rounded-full bg-indigo-900 font-bold text-white">
          Request a visit
        </Link>
      </div>
    </div>
  );
}
