import LoadingSpinner from "@/components/LoadingSpinner";

const FullScreenLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner />
        <p className="text-sm text-muted-foreground animate-pulse">
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
