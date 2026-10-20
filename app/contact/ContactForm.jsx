"use client";

import { useActionState } from "react";
import { requestCallback } from "./actions";
import { Copy } from "@/components/ui";
import { text } from "@/lib/copy";

// Input borders use --muted so the field edge meets 3:1 (WCAG 1.4.11).
const field =
  "mt-2 block w-full rounded-card border border-muted bg-surface px-4 py-3 text-ink focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink";

const C = (k) => <Copy path={`pages.form.${k}`} />;
// <option> takes plain text only
const T = (k) => text(`pages.form.${k}`) || "TODO(copy)";

// Name, phone or email, and preferred time only (COPY-BRIEF.md §3).
export default function ContactForm() {
  const [state, action, pending] = useActionState(requestCallback, { errors: {}, values: {} });
  const e = state?.errors || {};
  const v = state?.values || {};
  const hasErrors = Object.keys(e).length > 0;

  return (
    <form action={action} noValidate className="space-y-6" aria-describedby="form-note">
      {hasErrors && (
        <div role="alert" className="rounded-card border-2 border-ink bg-surface px-5 py-4">
          <p className="font-medium">{C("errorsTitle")}</p>
          <ul className="mt-1 list-disc pl-5">
            {Object.keys(e).map((k) => (
              <li key={k}>{C(e[k])}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="name" className="font-medium">
          {C("name")}
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          defaultValue={v.name}
          aria-invalid={!!e.name}
          aria-describedby={e.name ? "name-error" : undefined}
          className={field}
        />
        {e.name && (
          <p id="name-error" className="mt-1 text-small font-medium">
            {C("errorPrefix")} {C(e.name)}
          </p>
        )}
      </div>

      <fieldset aria-describedby={e.contact ? "contact-error" : "contact-hint"}>
        <legend className="font-medium">{C("reach")}</legend>
        <p id="contact-hint" className="text-small text-muted">
          {C("reachHint")}
        </p>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone">{C("phone")}</label>
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={v.phone} aria-invalid={!!e.contact} className={field} />
          </div>
          <div>
            <label htmlFor="email">{C("email")}</label>
            <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} aria-invalid={!!e.contact} className={field} />
          </div>
        </div>
        {e.contact && (
          <p id="contact-error" className="mt-1 text-small font-medium">
            {C("errorPrefix")} {C(e.contact)}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="time" className="font-medium">
          {C("time")} <span className="font-normal text-muted">{C("optional")}</span>
        </label>
        <select id="time" name="time" defaultValue={v.time || ""} className={field}>
          <option value="">{T("anyTime")}</option>
          <option value="morning">{T("morning")}</option>
          <option value="afternoon">{T("afternoon")}</option>
        </select>
      </div>

      <p id="form-note" className="border-l-2 border-line pl-4 text-small">
        <strong>{C("noteStrong")}</strong> {C("note")}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-8 py-3 font-medium text-surface transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {pending ? C("sending") : C("submit")}
      </button>
    </form>
  );
}
