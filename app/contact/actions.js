"use server";

import { redirect } from "next/navigation";

// Prototype only: nothing is sent or stored. In production this would hand the
// request to the practice's chosen system. It accepts contact details only,
// never health information. Errors are copy keys under pages.form.
export async function requestCallback(_prev, formData) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();

  const errors = {};
  if (!name) errors.name = "errorName";
  if (!phone && !email) errors.contact = "errorContact";
  if (Object.keys(errors).length) return { errors, values: { name, phone, email, time: formData.get("time") } };

  redirect("/contact/sent");
}
