"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { contact } from "@/content/site";
import { cn } from "@/lib/utils";
import { FilmFrame } from "./FilmFrame";
import { RiseText } from "./RiseText";

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

const input =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-faint focus:border-navy/50 focus:shadow-[0_0_0_4px_rgba(43,39,163,0.12)] aria-[invalid=true]:border-destructive";

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", site: "", note: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const update = (k: keyof typeof values, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k as Field]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const blur = (f: Field) => values[f] && setErrors((e) => ({ ...e, ...validate(values, f) }));

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    const subject = encodeURIComponent(`AI visibility audit for ${values.site}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nWebsite: ${values.site}\n\n${values.note}`,
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field = (f: Field, label: string, type: string, auto: string, placeholder: string) => (
    <div className="grid gap-2">
      <label htmlFor={`f-${f}`} className="text-[0.85rem] font-medium text-ink">
        {label} <span className="text-orange-deep" aria-hidden="true">*</span>
      </label>
      <input
        id={`f-${f}`}
        type={type}
        autoComplete={auto}
        inputMode={type === "url" ? "url" : undefined}
        placeholder={placeholder}
        value={values[f]}
        onChange={(e) => update(f, e.target.value)}
        onBlur={() => blur(f)}
        aria-invalid={!!errors[f]}
        aria-describedby={errors[f] ? `e-${f}` : undefined}
        required
        className={input}
      />
      {errors[f] && (
        <p id={`e-${f}`} role="alert" className="text-[0.8rem] text-destructive">
          {errors[f]}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" className="px-2 py-3 md:px-3">
      <FilmFrame
        name="sunrise"
        className="min-h-[100dvh]"
        overlay="bg-[linear-gradient(100deg,rgba(14,10,60,0.78)_0%,rgba(14,10,60,0.4)_45%,rgba(14,10,60,0)_80%)]"
      >
        <div className="grid min-h-[inherit] items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-[1.1fr_1fr] lg:px-14">
          <div>
            <h2 className="display max-w-[14ch] text-[clamp(2.5rem,5.2vw,4.8rem)] font-medium text-white">
              <RiseText text="Ask ChatGPT who to trust. If it isn’t you, talk to us." />
            </h2>
            <p className="mt-6 max-w-[30rem] text-[1.05rem] leading-relaxed text-white/75">
              Send your site and we will run your brand through ChatGPT, Perplexity, Gemini and AI Overviews, then
              walk you through what we find on a 30-minute call. No cost, no deck.
            </p>
            <a href={`mailto:${contact.email}`} className="link-line mt-8 inline-block text-[1.05rem] font-medium text-white">
              {contact.email}
            </a>
          </div>

          <div className="ui-card spot mx-auto w-full max-w-[30rem] overflow-hidden p-6 md:p-8 lg:mr-0">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="py-10 text-center"
                >
                  <CheckCircle size={44} weight="fill" className="mx-auto text-emerald-600" aria-hidden="true" />
                  <p className="display mt-5 text-[1.6rem] font-medium text-ink">Your email is ready to send.</p>
                  <p className="mx-auto mt-3 max-w-[22rem] text-ink-soft">
                    We reply within one working day with a time for your audit call.
                  </p>
                  <button type="button" onClick={() => setSent(false)} className="link-line mt-6 text-[0.9rem] font-medium text-navy">
                    Edit details
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={submit}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                  className="grid gap-5"
                >
                  <div>
                    <p className="text-[1.15rem] font-semibold tracking-tight text-ink">Free AI visibility audit</p>
                    <p className="mt-1 text-[0.88rem] text-ink-soft">Takes a minute. Fields marked * are required.</p>
                  </div>
                  {field("name", "Your name", "text", "name", "Amara Okonkwo")}
                  {field("email", "Work email", "email", "email", "amara@yourbrand.com")}
                  {field("site", "Website", "url", "url", "yourbrand.com")}
                  <div className="grid gap-2">
                    <label htmlFor="f-note" className="text-[0.85rem] font-medium text-ink">
                      What should AI say about you? <span className="font-normal text-ink-faint">(optional)</span>
                    </label>
                    <textarea
                      id="f-note"
                      rows={3}
                      value={values.note}
                      onChange={(e) => update("note", e.target.value)}
                      className={cn(input, "h-auto resize-none py-3")}
                    />
                  </div>
                  <button
                    type="submit"
                    className="press group mt-1 inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-orange py-3.5 text-[1rem] font-medium text-white transition-colors duration-200 hover:bg-orange-deep"
                  >
                    Request my audit
                    <ArrowRight size={16} weight="bold" className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </FilmFrame>
    </section>
  );
}
