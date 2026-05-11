import { TrendingUp } from "lucide-react";
import { CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { useGetDashboardData } from "../queries";

const chartConfig = {
  finishedTasks: { label: "Completed", color: "#10b981" },
  notFinishedTasks: { label: "In Progress", color: "#f59e0b" },
} satisfies ChartConfig;

export const TasksByProjectChart = () => {
  const { data } = useGetDashboardData();
  const { tasksByProject = [] } = data || {};

  // TODO: implement skeleton

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tasks by Project
        </CardTitle>
        <CardDescription>
          Complete breakdown of tasks across projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart data={tasksByProject}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="finishedTasks"
              fill="var(--color-finishedTasks)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="notFinishedTasks"
              fill="var(--color-notFinishedTasks)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
