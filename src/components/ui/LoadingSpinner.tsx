export function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div
        role="status"
        aria-label="Chargement"
        className="h-10 w-10 animate-spin rounded-full border-4 border-calma-ink/10 border-t-calma-ink"
      />
    </div>
  );
}
