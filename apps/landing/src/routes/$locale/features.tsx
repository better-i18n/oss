import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/features")({
  component: FeaturesLayout,
});

function FeaturesLayout() {
  return <Outlet />;
}
