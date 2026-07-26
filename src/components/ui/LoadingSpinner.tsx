export function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="h-10 w-10 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
    </div>
  );
}
