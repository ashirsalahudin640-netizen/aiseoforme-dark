import { contact, nav } from "@/content/site";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-white pt-20">
      <div className="frame grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-[22rem] text-ink-soft">
            An AI SEO studio. We get brands found on Google and quoted by the engines that answer.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 md:col-span-6 md:col-start-7 md:grid-cols-3">
          <div>
            <p className="text-sm text-ink-faint">Site</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link-line text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm text-ink-faint">Follow</p>
            <ul className="mt-4 space-y-2.5">
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="link-line text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm text-ink-faint">Say hello</p>
            <a href={`mailto:${contact.email}`} className="link-line mt-4 inline-block text-ink">
              {contact.email}
            </a>
          </div>
        </nav>
      </div>

      <div className="frame mt-20 flex flex-col justify-between gap-3 border-t border-line py-6 text-sm text-ink-faint md:flex-row">
        <p>© {new Date().getFullYear()} AI SEO For Me. All rights reserved.</p>
        <p>Remote-first, working with brands worldwide.</p>
      </div>

      <p
        aria-hidden="true"
        className="display pointer-events-none -mb-[0.2em] select-none whitespace-nowrap text-center text-[15.5vw] leading-none text-pearl-deep"
      >
        AI SEO For Me
      </p>
    </footer>
  );
}
