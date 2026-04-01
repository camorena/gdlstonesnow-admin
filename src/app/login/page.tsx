"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 bg-[#1a1a1a] px-6 py-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-[#8BB63A]" />
            <h1 className="text-xl font-bold text-white">GDL Stone Snow</h1>
          </div>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@gdlstonesnow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full bg-[#8BB63A] text-white hover:bg-[#7aa432]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
