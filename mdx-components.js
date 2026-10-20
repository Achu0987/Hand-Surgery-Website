// Required by @next/mdx. Symptom page copy now lives in lib/copy, so no MDX
// content is rendered; the old drafts in content/conditions are superseded.
export function useMDXComponents(inherited) {
  return { ...inherited };
}
