'use client';
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-amber-600">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Non Trouvée</h2>
          <p className="text-xl text-gray-600 mt-4">
            Désolé, la page que vous recherchez n'existe pas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour à l'Accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Page Précédente
          </button>
        </div>
      </div>
    </div>
  );
}
