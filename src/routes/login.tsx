import { createFileRoute } from "@tanstack/react-router";
import Auth11 from "../components/ui/auth-11";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return <Auth11 initialMode="login" />;
}
