import { CallButton, ScheduleButton } from "./ui";

// Thumb-reachable actions for one-handed phone use.
export default function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:hidden">
      <div className="grid grid-cols-2 gap-2">
        <CallButton className="px-3!" />
        <ScheduleButton className="px-3!" />
      </div>
    </div>
  );
}
