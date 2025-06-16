import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

export function CompletionBarChart({ completionPercentage = 0 }) {
  const chartData = [
    {
      label: "Completion",
      value: completionPercentage,
      fill: "var(--chart-1)",
    },
    {
      label: "Remaining",
      value: 100 - completionPercentage,
      fill: "var(--chart-muted)",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Progress</CardTitle>
        <CardDescription>{completionPercentage}% Completed</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          width={300}
          height={50}
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="label" hide />
          <Tooltip />
          <Bar dataKey="value" radius={[5, 5, 5, 5]}>
            {chartData.map((entry, index) => (
              <cell key={`bar-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </CardContent>
    </Card>
  )
}
