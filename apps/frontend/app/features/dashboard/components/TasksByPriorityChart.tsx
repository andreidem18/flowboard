import { useMemo } from "react";
import { CartesianGrid, XAxis, YAxis, Bar, Cell, BarChart } from "recharts";
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

const chartConfig = {
  Low: { label: "Low" },
  Medium: { label: "Medium" },
  High: { label: "High" },
} satisfies ChartConfig;

export const TasksByPriorityChart = () => {
  const { data } = useGetDashboardData();
  const { taskCount } = data || {};

  const tasksByPriority = useMemo(
    () => [
      { name: "Low", value: taskCount?.lowTasks, color: "#94a3b8" },
      { name: "Medium", value: taskCount?.mediumTasks, color: "#3b82f6" },
      { name: "High", value: taskCount?.highTasks, color: "#f97316" },
    ],
    [taskCount]
  );

  // TODO: implement skeletons
  if (!taskCount) return <></>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Priority</CardTitle>
        <CardDescription>Priority distribution of all tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart data={tasksByPriority}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {tasksByPriority.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
