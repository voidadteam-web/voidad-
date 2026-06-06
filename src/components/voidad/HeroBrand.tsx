import { VoidLogo } from "@/components/voidad/VoidLogo";

export function HeroBrand() {
  return (
    <div className="relative mx-auto mb-10 flex max-w-5xl justify-center px-2 sm:mb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-1/2 h-32 -translate-y-1/2 rounded-full bg-teal-400/10 blur-3xl"
      />
      <VoidLogo size="hero" priority className="relative z-10" />
    </div>
  );
}
