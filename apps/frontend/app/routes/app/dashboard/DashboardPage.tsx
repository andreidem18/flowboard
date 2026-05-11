import {
  DashboardOverview,
  ProjectProgress,
  TasksByPriorityChart,
  TasksByProjectChart,
  TasksByStatusChart,
  UpcomingDeadlines,
} from "~/features/dashboard/components";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-semibold text-transparent">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your tasks and projects
        </p>
      </div>
      <DashboardOverview />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TasksByStatusChart />
        <TasksByPriorityChart />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProjectProgress />
        <UpcomingDeadlines />
      </div>
      <TasksByProjectChart />
    </div>
  );
}
