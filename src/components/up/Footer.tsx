import { contact, nav } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { SpaceLogo } from "./SpaceLogo";

export function Footer() {
  return (
    <footer className="relative mt-3 overflow-hidden rounded-t-[2.5rem] bg-[radial-gradient(ellipse_at_50%_70%,#1b1670_0%,#0b0838_45%,#05041a_100%)] pt-20 text-white md:rounded-t-[4rem]">
      <div className="frame relative z-10">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo tone="dark" />
            <p className="mt-5 max-w-[24rem] text-white/65">
              An AI SEO studio. We get brands found on Google and quoted by the engines that answer.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 md:col-span-6 md:col-start-7 md:grid-cols-3">
            <div>
              <p className="text-[0.9rem] text-white/45">Site</p>
              <ul className="mt-4 space-y-2.5">
                {nav.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="link-line text-white/90">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.9rem] text-white/45">Follow</p>
              <ul className="mt-4 space-y-2.5">
                {contact.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="link-line text-white/90">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-[0.9rem] text-white/45">Write</p>
              <a href={`mailto:${contact.email}`} className="link-line mt-4 inline-block text-white/90">
                {contact.email}
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* The mark as an object in space. */}
      <div className="relative -mt-6 h-[58vh] min-h-[380px] md:h-[78vh]">
        <SpaceLogo className="absolute inset-0" />
      </div>

      <div className="frame relative z-10 border-t border-white/10 py-6">
        <p className="mx-auto flex max-w-[1400px] justify-between text-[0.85rem] text-white/45">
          <span>© {new Date().getFullYear()} AI SEO For Me</span>
          <span>Made to be cited.</span>
        </p>
      </div>
    </footer>
  );
}
