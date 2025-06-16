import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export function ChartPieLegend({ pieChartData }) {
  const chartData = [
    {
      label: "Completed",
      value: pieChartData?.completed || 0,
      fill: "var(--chart-1)",
    },
    {
      label: "Not Completed",
      value: pieChartData?.notCompleted || 0,
      fill: "var(--chart-2)",
    },
  ]

  const chartConfig = {
    value: {
      label: "Count",
    },
    Completed: {
      label: "Completed",
      color: "var(--chart-1)",
    },
    "Not Completed": {
      label: "Not Completed",
      color: "var(--chart-2)",
    },
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Habit Completion</CardTitle>
        <CardDescription>Completed vs Not Completed</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              outerRadius={90}
              fill="var(--chart-1)"
              // label removed here
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="label" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
