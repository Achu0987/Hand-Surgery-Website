import Link from "next/link";
import { resolve, SHOW_DRAFTS } from "@/lib/copy";

export function Container({ className = "", wide = false, children, ...rest }) {
  return (
    <div className={`mx-auto w-full ${wide ? "max-w-[82rem]" : "max-w-6xl"} px-4 sm:px-6 lg:px-8 ${className}`} {...rest}>
      {children}
    </div>
  );
}

// Visible marker for anything not yet supplied: TODO(copy), TODO(image)...
export function Todo({ kind = "copy", children }) {
  return (
    <span className="todo">
      TODO({kind}){children ? <>: {children}</> : null}
    </span>
  );
}

// The final icon set has not been supplied (DESIGN.md §6). Marks the spot in
// every build; never replaced with a stand-in icon.
export function IconTodo() {
  return (
    <span className="todo-icon" aria-hidden="true">
      TODO(icon)
    </span>
  );
}

// One resolved copy value: approved text, marked draft text, or a TODO.
export function Value({ status, value }) {
  if (value && typeof value === "object" && "todo" in value) return <Todo>{value.todo}</Todo>;
  if (status === "draft") return <span className="copy-draft">{value}</span>;
  return value;
}

export function Copy({ path }) {
  return <Value {...resolve(path)} />;
}

// A list slot (array of strings and todo entries)
export function CopyList({ path, ordered = false, className = "" }) {
  const { status, value } = resolve(path);
  if (!Array.isArray(value)) return <p className={className}><Value status={status} value={value} /></p>;
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={className}>
      {value.map((item, i) => (
        <li key={i}>
          <Value status={status} value={item} />
        </li>
      ))}
    </Tag>
  );
}

export function DraftBanner() {
  if (!SHOW_DRAFTS) return null;
  return (
    <div className="border-b border-line bg-base">
      <Container className="py-2 text-small text-muted">
        Review build. <span className="copy-draft">Dotted underlines</span> mark draft copy awaiting approval.{" "}
        <span className="todo">TODO</span> marks content still to be supplied.
      </Container>
    </div>
  );
}

// S12. The cyan rule is one of the two approved cyan uses (DESIGN.md §2).
export function Disclaimer({ className = "" }) {
  return (
    <p className={`border-l-[3px] border-logo-cyan pl-4 text-small text-muted ${className}`}>
      <Copy path="site.disclaimer" />
    </p>
  );
}

export function Eyebrow({ children, className = "" }) {
  return <p className={`text-small font-medium text-muted ${className}`}>{children}</p>;
}

const buttonStyles = {
  // One filled accent action per section; its outlined secondary may sit beside
  // it (DESIGN.md §2, §5). Other emphasis uses ink.
  primary: "bg-accent text-surface hover:opacity-90",
  secondary: "bg-transparent text-accent ring-1 ring-inset ring-accent hover:bg-surface",
};

export function ButtonLink({ href, children, variant = "primary", className = "" }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-2.5 font-medium transition-opacity ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function ScheduleButton({ className = "", variant = "primary" }) {
  return (
    <ButtonLink href="/contact" variant={variant} className={className}>
      <IconTodo />
      <Copy path="site.labels.schedule" />
    </ButtonLink>
  );
}

// The phone number has not been supplied, so this links to the call details on
// the contact page. Swap for a tel: link once S13 is approved.
export function CallButton({ className = "", variant = "secondary" }) {
  return (
    <ButtonLink href="/contact#call" variant={variant} className={className}>
      <IconTodo />
      <Copy path="site.labels.call" />
    </ButtonLink>
  );
}
