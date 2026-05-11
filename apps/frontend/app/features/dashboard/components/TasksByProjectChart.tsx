import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  BarChart,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { useGetDashboardData } from "../queries";
import { ChartTooltip } from "~/components/ui/chart";

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
      <CardContent className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={tasksByProject}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip />
            <Legend />
            <Bar
              dataKey="finishedTasks"
              fill="#10b981"
              name="Completed"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="notFinishedTasks"
              fill="#f59e0b"
              name="In Progress"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
