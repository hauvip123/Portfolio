import { createFileRoute } from "@tanstack/react-router";
import { PortfolioDeck } from "@/components/portfolio-deck";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nguyen Van Hau — Full Stack Developer Portfolio" },
      {
        name: "description",
        content:
          "Full Stack Developer Intern crafting modern, animated web experiences with React, TypeScript, Node.js & Go.",
      },
      { property: "og:title", content: "Nguyen Van Hau — Full Stack Developer" },
      { property: "og:description", content: "React · TypeScript · Node.js · Go · Microservices" },
    ],
  }),
  component: PortfolioDeck,
});
