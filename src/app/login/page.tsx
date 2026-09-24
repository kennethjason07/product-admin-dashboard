import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sign in to ProductHub
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Login form will be implemented in Phase 2
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          <p className="text-center text-text-muted text-sm">
            Authentication coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
