import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  User,
  LogOut,
  ArrowLeft,
  Shield,
  Sparkles,
  Image,
  CheckCircle,
  Mail,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/" });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="px-4 py-3">
          <Header />
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl border-2 border-foreground bg-card p-8 text-center shadow-toy">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-2 border-foreground bg-primary/20 text-primary mb-6">
              <User className="h-8 w-8" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Account Required</h1>
            <p className="text-muted-foreground text-sm mb-6">
              Please sign in or create an account to view and manage your profile settings.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center rounded-xl border-2 border-foreground bg-primary py-3 text-sm font-bold text-primary-foreground shadow-toy-sm hover:shadow-toy transition-all"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="w-full inline-flex items-center justify-center rounded-xl border-2 border-foreground bg-secondary py-3 text-sm font-bold text-secondary-foreground shadow-toy-sm hover:shadow-toy transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="px-4 py-3">
        <Header />
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Background Remover</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-destructive/10 text-destructive px-4 py-2 text-xs font-bold shadow-toy-xs hover:bg-destructive hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 border-foreground bg-card p-6 sm:p-10 shadow-toy"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b-2 border-border">
            <div className="grid h-20 w-20 place-items-center rounded-2xl border-2 border-foreground bg-primary text-primary-foreground font-display text-3xl font-bold shadow-toy-sm">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="grow">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-secondary px-3 py-0.5 text-xs font-bold text-secondary-foreground shadow-toy-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  {user.plan}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Account Metrics Grid */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <div className="rounded-2xl border-2 border-foreground bg-muted/30 p-5 shadow-toy-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Plan Status</span>
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <p className="font-display text-xl font-bold text-foreground">Active Tier</p>
              <p className="text-xs text-muted-foreground mt-1">Unlimited background removals</p>
            </div>

            <div className="rounded-2xl border-2 border-foreground bg-muted/30 p-5 shadow-toy-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Exports Done</span>
                <Image className="h-4 w-4 text-secondary-foreground" />
              </div>
              <p className="font-display text-xl font-bold text-foreground">HD Transparent PNG</p>
              <p className="text-xs text-muted-foreground mt-1">Zero watermark export</p>
            </div>

            <div className="rounded-2xl border-2 border-foreground bg-muted/30 p-5 shadow-toy-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Member Since</span>
                <Calendar className="h-4 w-4 text-accent-foreground" />
              </div>
              <p className="font-display text-xl font-bold text-foreground">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Verified Community Member</p>
            </div>
          </div>

          {/* Account Benefits List */}
          <div className="mt-8 rounded-2xl border-2 border-foreground bg-background p-6">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Your Account Perks
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary-foreground" />
                Cloud-accelerated sub-second AI background separation.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary-foreground" />
                Lossless full-resolution transparent PNG downloads.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary-foreground" />
                Dual-engine automatic fallback with local in-browser processing.
              </li>
            </ul>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
