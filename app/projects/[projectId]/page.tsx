import { notFound } from "next/navigation";

import { ProjectWorkspace } from "@/components/projects/ProjectWorkspace";
import { getStudioProject } from "@/lib/studio-data";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = getStudioProject(projectId);

  if (!project) {
    notFound();
  }

  return <ProjectWorkspace project={project} />;
}
