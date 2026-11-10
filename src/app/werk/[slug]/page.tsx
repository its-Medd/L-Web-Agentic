import { ProjectPage } from "@/components/sites/L'WebAgentic/interior-pages";
import { notFound, redirect } from "next/navigation";
import content from "@/components/sites/L'WebAgentic/interior-data.json";

export function generateStaticParams() {
  return content.work.map(({ slug }) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "roc-midden-nl") redirect("/werk/roc-midden-nederland");
  if (slug === "campus-013") redirect("/werk/campus013");
  if (!content.work.some(project => project.slug === slug)) notFound();
  return <ProjectPage slug={slug} />;
}
