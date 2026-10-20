import { Fragment } from "react";

// Wraps each word so it can rise from behind a mask. The full sentence stays
// in the DOM as normal text for screen readers and no-JS visitors.
export default function SplitWords({ text, as: Tag = "span", className = "", ...rest }) {
  const words = text.split(" ");
  return (
    <Tag className={className} {...rest}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="sw inline-block overflow-hidden pb-[0.12em] align-top">
            <span className="inline-block will-change-transform">{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
