import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { useGetDashboardData } from "../queries";
import { formatPercentage } from "../utils";
import type { TasksCount } from "@repo/shared";

export const DashboardOverview = () => {
  const { data } = useGetDashboardData();
  const { taskCount } = data || {};

  // TODO: implement skeletons
  if (!taskCount) return <></>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {OVERVIEW_CARDS.map((card) => {
        const colors = getColorClasses(card.color);
        const Icon = card.icon;

        return (
          <Card key={card.title} className={cn(colors.border, colors.bg)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={cn("h-4 w-4", colors.icon)} />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", colors.text)}>
                {card.getValue(taskCount)}
              </div>
              <p className={cn("mt-1 text-xs", colors.subtitle)}>
                {card.getSubtitle(taskCount)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

type Color = "blue" | "amber" | "green" | "red";

interface OverviewCardConfig {
  title: string;
  icon: LucideIcon;
  color: Color;
  getValue: (taskCount: TasksCount) => number;
  getSubtitle: (taskCount: TasksCount) => string;
}

const getColorClasses = (color: Color) => {
  const colorMap: Record<
    Color,
    { border: string; bg: string; text: string; icon: string; subtitle: string }
  > = {
    blue: {
      border: "border-blue-200 dark:border-blue-800",
      bg: "bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
      text: "text-blue-700 dark:text-blue-300",
      icon: "text-blue-600 dark:text-blue-400",
      subtitle: "text-blue-600 dark:text-blue-400",
    },
    amber: {
      border: "border-amber-200 dark:border-amber-800",
      bg: "bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20",
      text: "text-amber-700 dark:text-amber-300",
      icon: "text-amber-600 dark:text-amber-400",
      subtitle: "text-amber-600 dark:text-amber-400",
    },
    green: {
      border: "border-green-200 dark:border-green-800",
      bg: "bg-linear-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20",
      text: "text-green-700 dark:text-green-300",
      icon: "text-green-600 dark:text-green-400",
      subtitle: "text-green-600 dark:text-green-400",
    },
    red: {
      border: "border-red-200 dark:border-red-800",
      bg: "bg-linear-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20",
      text: "text-red-700 dark:text-red-300",
      icon: "text-red-600 dark:text-red-400",
      subtitle: "text-red-600 dark:text-red-400",
    },
  };
  return colorMap[color];
};

const OVERVIEW_CARDS: OverviewCardConfig[] = [
  {
    title: "Total Tasks",
    icon: BarChart3,
    color: "blue",
    getValue: (taskCount) => taskCount.totalTasks,
    getSubtitle: (taskCount) =>
      `${formatPercentage(taskCount.completedTasks / taskCount.totalTasks)} completed`,
  },
  {
    title: "In Progress",
    icon: Clock,
    color: "amber",
    getValue: (taskCount) => taskCount.inProgressTasks,
    getSubtitle: () => "Active tasks",
  },
  {
    title: "Completed",
    icon: CheckCircle2,
    color: "green",
    getValue: (taskCount) => taskCount.completedTasks,
    getSubtitle: () => "Finished tasks",
  },
  {
    title: "Overdue",
    icon: AlertTriangle,
    color: "red",
    getValue: (taskCount) => taskCount.overdueTasks,
    getSubtitle: () => "Past deadline",
  },
];
