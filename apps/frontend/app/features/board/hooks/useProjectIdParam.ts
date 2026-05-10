import { useParams } from "react-router";

export const useProjectIdParam = () => {
  const { projectId } = useParams();

  if (projectId !== "all" && !isNaN(Number(projectId))) {
    return Number(projectId);
  }
  return undefined;
};
