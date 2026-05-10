import { Target } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { useGetDashboardData } from "../queries";

export const ProjectProgress = () => {
  const { data } = useGetDashboardData();
  const { tasksByProject = [] } = data || {};

  // TODO: implement loading state

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Project Progress
        </CardTitle>
        <CardDescription>Task completion by project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasksByProject.map((project) => {
          const progress =
            project.totalTasks > 0
              ? Math.round((project.finishedTasks / project.totalTasks) * 100)
              : 0;

          return (
            <div key={project.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color || "" }}
                  />
                  <span className="text-sm font-medium">{project.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {project.finishedTasks}/{project.totalTasks}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
