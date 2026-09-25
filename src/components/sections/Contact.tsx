"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { contact } from "@/content/site";

type Field = "name" | "email" | "site";
type Errors = Partial<Record<Field, string>>;

function validate(values: Record<string, string>, field?: Field): Errors {
  const e: Errors = {};
  const check = (f: Field) => !field || field === f;
  if (check("name") && !values.name.trim()) e.name = "Add your name so we know who to reply to.";
  if (check("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    e.email = "Enter an email address like name@company.com.";
  if (check("site") && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(values.site.trim()))
    e.site = "Enter your website, for example yourbrand.com.";
  return e;
}

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", site: "", note: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const update = (k: keyof typeof values, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k as Field]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const blur = (f: Field) => setErrors((e) => ({ ...e, ...validate(values, f) }));

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    const subject = encodeURIComponent(`AI visibility check for ${values.site}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nWebsite: ${values.site}\n\n${values.note}`,
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const input =
    "h-12 w-full rounded-xl border border-line bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-faint focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,91,20,0.15)] aria-[invalid=true]:border-destructive";

  return (
    <section id="contact" className="relative z-10 overflow-hidden bg-pearl py-24 md:py-36">
      <Image
        src="/stock/orange-light.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-70"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-pearl via-pearl/40 to-pearl/10" aria-hidden="true" />

      <div className="frame relative grid gap-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 className="display text-[clamp(2.3rem,5.4vw,5rem)]">Find out what AI says about you.</h2>
          <p className="lede mt-6 text-ink">
            Send us your site. Within two working days we will ask the major engines about your brand and your
            category, and send back what they said, who they cited, and what we would fix first. It is free.
          </p>
          <p className="mt-10 text-[0.95rem] text-ink-soft">
            Prefer email?{" "}
            <a href={`mailto:${contact.email}`} className="link-line font-medium text-ink">
              {contact.email}
            </a>
          </p>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <div className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-[0_40px_80px_-40px_rgba(179,53,5,0.45)] backdrop-blur-md md:p-8">
            {sent ? (
              <div className="flex min-h-[380px] flex-col items-start justify-center" role="status">
                <CheckCircle size={40} weight="fill" className="text-orange" />
                <h3 className="display mt-5 text-2xl">Your email is ready to send.</h3>
                <p className="mt-3 text-ink-soft">
                  We opened your email app with the details filled in. Send it and we will reply within two
                  working days.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="press link-line mt-6 text-sm font-medium text-ink"
                >
                  Edit the details
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={submit} className="space-y-5">
                {(
                  [
                    { f: "name", label: "Your name", type: "text", auto: "name", ph: "Priya Raman" },
                    { f: "email", label: "Work email", type: "email", auto: "email", ph: "priya@yourbrand.com" },
                    { f: "site", label: "Website", type: "url", auto: "url", ph: "yourbrand.com" },
                  ] as const
                ).map(({ f, label, type, auto, ph }) => (
                  <div key={f} className="grid gap-2">
                    <label htmlFor={`f-${f}`} className="text-sm font-medium text-ink">
                      {label} <span className="text-orange" aria-hidden="true">*</span>
                    </label>
                    <input
                      id={`f-${f}`}
                      name={f}
                      type={type}
                      inputMode={type === "url" ? "url" : undefined}
                      autoComplete={auto}
                      placeholder={ph}
                      required
                      value={values[f]}
                      onChange={(e) => update(f, e.target.value)}
                      onBlur={() => values[f] && blur(f)}
                      aria-invalid={!!errors[f]}
                      aria-describedby={errors[f] ? `e-${f}` : undefined}
                      className={input}
                    />
                    {errors[f] && (
                      <p id={`e-${f}`} className="text-sm text-destructive" role="alert">
                        {errors[f]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="grid gap-2">
                  <label htmlFor="f-note" className="text-sm font-medium text-ink">
                    Anything we should look at first?
                  </label>
                  <textarea
                    id="f-note"
                    rows={3}
                    value={values.note}
                    onChange={(e) => update("note", e.target.value)}
                    placeholder="Competitors, key products, markets…"
                    className={`${input} h-auto resize-none py-3`}
                  />
                </div>
                <button
                  type="submit"
                  className="press h-14 w-full rounded-full bg-orange text-base font-medium text-white transition-colors duration-200 hover:bg-orange-deep"
                >
                  Get my free AI visibility check
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
