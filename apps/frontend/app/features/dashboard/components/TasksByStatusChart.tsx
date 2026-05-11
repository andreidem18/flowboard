import { Cell, Pie, PieChart } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { useGetDashboardData } from "../queries";
import { useMemo } from "react";
import { formatPercentage } from "../utils";

const chartConfig = {
  New: { label: "New" },
  "In Progress": { label: "In Progress" },
  Stopped: { label: "Stopped" },
  Finished: { label: "Finished" },
} satisfies ChartConfig;

export const TasksByStatusChart = () => {
  const { data } = useGetDashboardData();
  const { taskCount } = data || {};

  const tasksByStatus = useMemo(
    () => [
      { name: "New", value: taskCount?.newTasks, color: "#3b82f6" },
      {
        name: "In Progress",
        value: taskCount?.inProgressTasks,
        color: "#f59e0b",
      },
      { name: "Stopped", value: taskCount?.stoppedTasks, color: "#ef4444" },
      { name: "Finished", value: taskCount?.completedTasks, color: "#10b981" },
    ],
    [taskCount]
  );

  // TODO: implement skeletons
  if (!taskCount) return <></>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Status</CardTitle>
        <CardDescription>
          Distribution of tasks across different statuses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <PieChart>
            <Pie
              data={tasksByStatus}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${formatPercentage(percent || 0)}`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {tasksByStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
