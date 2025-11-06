import type { Route } from "./+types/home";
import { Editor } from "~/components/Editor";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AirDeck - Create Your Presentation" },
    { name: "description", content: "Create beautiful presentations with Markdown and present with AI gesture controls" },
  ];
}

export default function Home() {
  return <Editor />;
}
