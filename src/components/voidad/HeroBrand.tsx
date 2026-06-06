import { VoidLogo } from "@/components/voidad/VoidLogo";

export function HeroBrand() {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-center px-2 sm:max-w-4xl">
      <VoidLogo size="hero" priority />
    </div>
  );
}
