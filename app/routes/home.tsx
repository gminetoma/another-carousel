import items from "~/pages/items";
import type { Route } from "./+types/home";
import HomePage from "~/pages/HomePage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Another Carousel" }];
}

export const loader = () => {
  return { items };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;

  return <HomePage items={items} />;
}
