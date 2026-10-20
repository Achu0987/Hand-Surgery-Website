"use client";

import { useActionState, useEffect, useRef } from "react";
import { requestCallback } from "./actions";

const field =
  "mt-2 block w-full rounded-xl border border-[#b9bdd6] bg-white px-4 py-3 text-[1.05rem] text-ink shadow-sm focus:border-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-700/15";

export default function ContactForm() {
  const [state, action, pending] = useActionState(requestCallback, { errors: {}, values: {} });
  const e = state?.errors || {};
  const v = state?.values || {};
  const hasErrors = Object.keys(e).length > 0;
  const formRef = useRef(null);

  // "Request an appointment" links point at this page. When the visitor is
  // already here, take them to the form and put the cursor in the first field
  // instead of doing nothing.
  useEffect(() => {
    const onClick = (ev) => {
      const link = ev.target.closest("a[href]");
      if (!link || new URL(link.href).pathname !== "/contact" || new URL(link.href).hash) return;
      ev.preventDefault();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (window.__lenis && !reduced) window.__lenis.scrollTo(formRef.current, { offset: -160 });
      else formRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      formRef.current?.querySelector("#name")?.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <form ref={formRef} action={action} noValidate className="space-y-6" aria-describedby="form-note">
      {hasErrors && (
        <div role="alert" className="rounded-2xl border border-red-700/30 bg-red-50 px-5 py-4 text-red-900">
          <p className="font-bold">Please check the form</p>
          <ul className="mt-1 list-disc pl-5">
            {Object.values(e).map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="name" className="font-bold text-indigo-950">
          Your name
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
          <p id="name-error" className="mt-1 text-sm text-red-800">
            {e.name}
          </p>
        )}
      </div>

      <fieldset aria-describedby={e.contact ? "contact-error" : "contact-hint"}>
        <legend className="font-bold text-indigo-950">How can the office reach you?</legend>
        <p id="contact-hint" className="text-sm text-ink-soft">
          One of these is enough.
        </p>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="text-[0.95rem]">
              Phone
            </label>
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={v.phone} aria-invalid={!!e.contact} className={field} />
          </div>
          <div>
            <label htmlFor="email" className="text-[0.95rem]">
              Email
            </label>
            <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} aria-invalid={!!e.contact} className={field} />
          </div>
        </div>
        {e.contact && (
          <p id="contact-error" className="mt-1 text-sm text-red-800">
            {e.contact}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="time" className="font-bold text-indigo-950">
          Best time to call <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <select id="time" name="time" defaultValue={v.time || ""} className={field}>
          <option value="">Any time</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
        </select>
      </div>

      <p id="form-note" className="rounded-2xl bg-indigo-50 px-5 py-4 text-[0.95rem]">
        <strong className="text-indigo-950">Please do not include symptoms or medical details.</strong> This form is only for
        contact details. The office will ask what it needs when it calls you.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-indigo-900 px-8 py-3 text-lg font-bold text-white transition hover:bg-indigo-800 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending" : "Ask the office to call me"}
      </button>
    </form>
  );
}
