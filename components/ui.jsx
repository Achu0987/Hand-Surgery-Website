import Link from "next/link";

export function Container({ className = "", children, ...rest }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`} {...rest}>
      {children}
    </div>
  );
}

// Visible marker for content the practice still has to supply.
export function Placeholder({ children }) {
  return (
    <span className="placeholder">
      <span className="sr-only">Placeholder: </span>[{children}]
    </span>
  );
}

// Marks proposed clinical wording that has not been reviewed by the surgeon.
export function DraftTag({ label = "Draft, pending surgeon review" }) {
  return (
    <span className="ml-1 inline-flex translate-y-[-1px] items-center rounded-full bg-draft-bg px-2 py-0.5 align-middle text-[11px] font-bold uppercase tracking-wide text-draft ring-1 ring-draft/25">
      {label}
    </span>
  );
}

export function DraftNotice({ children }) {
  return (
    <div className="rounded-2xl border border-draft/25 bg-draft-bg px-5 py-4 text-[0.95rem] text-ink" role="note">
      <p className="font-bold text-draft">Draft clinical content</p>
      <p className="mt-1">
        {children ||
          "This page is proposed wording for the practice. It has not yet been reviewed by Dr. Traverso and must not be published until it has."}
      </p>
    </div>
  );
}

export function Disclaimer({ className = "" }) {
  return (
    <p className={`text-sm text-ink-soft ${className}`}>
      This information is general and educational. It is not a diagnosis and is not a substitute for a consultation with a
      clinician who can examine your hand.
    </p>
  );
}

export function Eyebrow({ children, dark = false }) {
  return (
    <p className={`text-sm font-bold uppercase tracking-[0.14em] ${dark ? "text-cyan-300" : "text-cyan-700"}`}>{children}</p>
  );
}

export function ButtonLink({ href, children, variant = "primary", className = "" }) {
  const styles = {
    primary: "bg-indigo-900 text-white hover:bg-indigo-800",
    light: "bg-cyan-300 text-indigo-950 hover:bg-cyan-200",
    ghost: "bg-transparent text-indigo-900 ring-1 ring-indigo-900/25 hover:bg-indigo-50",
    ghostDark: "bg-white/5 text-white ring-1 ring-white/25 hover:bg-white/10",
  };
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 font-bold transition ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
