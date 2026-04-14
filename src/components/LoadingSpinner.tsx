import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ className = "" }: { className?: string }) => (
  <Loader2 className={`h-5 w-5 animate-spin ${className}`} />
);

export default LoadingSpinner;
