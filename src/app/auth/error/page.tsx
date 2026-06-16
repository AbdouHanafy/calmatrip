import Link from "next/link";
import { Plane, AlertTriangle } from "lucide-react";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  let errorMessage = "An unknown error occurred.";
  if (error === "Configuration") {
    errorMessage = "There is a problem with the server configuration. Please contact support.";
  } else if (error === "AccessDenied") {
    errorMessage = "Access denied. You do not have permission to log in.";
  } else if (error === "Verification") {
    errorMessage = "The token has expired or has already been used. Please try again.";
  } else if (error === "OAuthSignin" || error === "OAuthCallback" || error === "OAuthCreateAccount" || error === "EmailCreateAccount" || error === "Callback" || error === "OAuthAccountNotLinked" || error === "EmailSignin" || error === "CredentialsSignin") {
    errorMessage = "There was a problem signing in with the provider. Please try again.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0A1A2F] via-[#0F2740] to-[#1B4F6E] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-red-400 rounded-full blur-[120px] opacity-10" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FFD700] rounded-full blur-[140px] opacity-10" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white">
              Authentication Error
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong.
          </h1>
          <p className="text-gray-600 mb-8 bg-red-50 p-4 rounded-xl border border-red-100">
            {errorMessage}
          </p>

          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </Link>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-[#87CEEB] transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
