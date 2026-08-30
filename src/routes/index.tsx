import { createFileRoute } from "@tanstack/react-router";
import { StereoscopeApp } from "@/components/player/stereoscope-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <StereoscopeApp />;
}
