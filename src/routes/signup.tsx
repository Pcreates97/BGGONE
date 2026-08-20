import { createFileRoute } from "@tanstack/react-router";
import Auth11 from "../components/ui/auth-11";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  return <Auth11 initialMode="signup" />;
}
