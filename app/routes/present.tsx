import type { Route } from "./+types/present";
import { PresentationView } from "~/components/PresentationView";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Presentation - AirDeck" },
    { name: "description", content: "Present your slides with AI gesture controls" },
  ];
}

export default function Present() {
  return <PresentationView />;
}
