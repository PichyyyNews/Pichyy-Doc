import { redirect } from "next/navigation";
import { getAllDocSpaces } from "@/lib/storage";

export default async function HomePage() {
  const spaces = await getAllDocSpaces();
  const defaultSpace = spaces.find((s) => s.isDefault) || spaces[0];

  if (defaultSpace && defaultSpace.pages.length > 0) {
    const firstPage = defaultSpace.pages[0];
    redirect(`/docs/${defaultSpace.slug}/${firstPage.slug}`);
  }

  redirect("/admin");
}
