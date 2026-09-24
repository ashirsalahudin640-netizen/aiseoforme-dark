"use client";

import { AwwwardsNav } from "@/components/ui/awwwards-nav";
import { contact, nav, services, work } from "@/content/site";
import { store } from "@/lib/store";

/**
 * VengeanceUI AwwwardsNav as a floating glass dock: section links inline, and
 * a "Menu" button that unfolds into a mega-menu of services, work and contact.
 */
export function Dock() {
  return (
    <AwwwardsNav
      moreLabel="Menu"
      items={nav}
      onOpenChange={(open) => (open ? store.lenis?.stop() : store.lenis?.start())}
      columns={[
        { title: "Services", links: services.slice(0, 4).map((s) => ({ label: s.title, href: "#services" })) },
        { title: "Work", links: work.map((w) => ({ label: w.client, href: `#case-${w.id}` })) },
        { title: "Studio", links: [{ label: "Process", href: "#process" }, { label: "About", href: "#about" }, { label: "Contact", href: "#contact" }] },
        { title: "Elsewhere", links: [{ label: "Email us", href: `mailto:${contact.email}` }, ...contact.socials] },
      ]}
      className="z-[65]"
    />
  );
}
