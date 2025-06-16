import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function ChartLineDefault({ data }) {
  // Transform incoming data to chart format
  const chartData = data?.map(({ date, count }) => {
    const dateObj = new Date(date);
    const label = dateObj.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    return {
      date: label,
      count,
    };
  });

  const chartConfig = {
    count: {
      label: "Completion Count",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Completion Chart</CardTitle>
        <CardDescription>
          Showing completions for the last {data?.length} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            <YAxis domain={[0, 1.5]} hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="count"
              type="monotone"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={true} // highlight active days
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total completions for the selected period
        </div>
      </CardFooter> */}
    </Card>
  );
}
