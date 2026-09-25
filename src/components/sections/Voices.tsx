import { TestimonialsCard } from "@/components/ui/testimonials-card";
import { voices } from "@/content/site";

export function Voices() {
  return (
    <section id="voices" className="relative z-10 overflow-hidden bg-white py-24 md:py-32">
      <div className="frame grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="display text-[clamp(2.1rem,4.4vw,4rem)]">In their words.</h2>
          <p className="lede mt-6">
            Growth leads and founders on what changed once the engines started answering with their names.
          </p>
        </div>
        <div className="md:col-span-7">
          <TestimonialsCard items={voices} width={760} className="p-0 md:p-8" />
        </div>
      </div>
    </section>
  );
}
