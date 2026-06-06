import { Link } from "@/i18n/navigation";
import { VoidButton } from "@/components/ui/VoidButton";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
      <p className="text-6xl font-bold text-void-green void-glow-text">404</p>
      <h1 className="mt-4 text-xl font-semibold text-white">Page not found</h1>
      <p className="mt-2 text-sm text-void-muted">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="mt-8">
        <VoidButton variant="secondary">Home</VoidButton>
      </Link>
    </div>
  );
}
