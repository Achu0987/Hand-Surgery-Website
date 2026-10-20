import { Placeholder, DraftTag } from "@/components/ui";

const components = {
  Placeholder,
  DraftTag,
  SeekHelp: ({ children }) => (
    <aside className="my-6 rounded-2xl border-l-4 border-indigo-700 bg-indigo-50 px-5 py-4 not-italic" aria-label="When to get help sooner">
      <p className="mb-1 font-bold text-indigo-900">When to get help sooner</p>
      <div className="[&>p]:mb-0">{children}</div>
    </aside>
  ),
};

export function useMDXComponents(inherited) {
  return { ...inherited, ...components };
}
