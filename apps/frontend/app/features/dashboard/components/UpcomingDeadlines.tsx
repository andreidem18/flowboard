import { Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { useGetDashboardData } from "../queries";
import { Badge } from "~/components/ui/badge";
import { format } from "date-fns";
import type { UpcomingTasks } from "@repo/shared";
import { Link } from "react-router";

export const UpcomingDeadlines = () => {
  const { data } = useGetDashboardData();
  const { upcomingTasks = [] } = data || {};

  // TODO: implement loading state

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
        <CardDescription>Tasks due soon</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingTasks.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No upcoming deadlines
          </p>
        ) : (
          upcomingTasks.map((task) => (
            <DeadlineItem key={task.id} task={task} />
          ))
        )}
      </CardContent>
    </Card>
  );
};

type DeadlineStatus = "overdue" | "urgent" | "normal";

function DeadlineItem({ task }: { task: UpcomingTasks }) {
  const status = getDeadlineStatus(task.daysLeft);

  return (
    <Link
      to={`/app/board/${task.project.id}`}
      className="flex items-start justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">{task.name}</h4>
          {status === "overdue" && (
            <Badge variant="destructive" className="text-xs">
              Overdue
            </Badge>
          )}
          {status === "urgent" && (
            <Badge className="bg-orange-500 text-xs">Urgent</Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: task.project.color || "" }}
          />
          {task.project.name}
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${getStatusColor(status)}`}>
          {formatDaysLabel(task.daysLeft, status)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(task.deadline!), "MMM d")}
        </p>
      </div>
    </Link>
  );
}

function getDeadlineStatus(
  daysLeft: number | null | undefined
): DeadlineStatus {
  if (daysLeft == null) return "normal";
  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 3) return "urgent";
  return "normal";
}

function getStatusColor(status: DeadlineStatus): string {
  if (status === "overdue") return "text-red-600 dark:text-red-400";
  if (status === "urgent") return "text-orange-600 dark:text-orange-400";
  return "text-muted-foreground";
}

function formatDaysLabel(
  daysLeft: number | null | undefined,
  status: DeadlineStatus
): string {
  if (status === "overdue") return `${Math.abs(daysLeft ?? 0)} days ago`;
  if (daysLeft === 0) return "Today";
  return `${daysLeft} days`;
}
