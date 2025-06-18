import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function HabitDetails({
  habit,
  editable = false,
  onChange,
  onSubmit,
  loading = false,
  header = "Habit Details",
  actionLabel = "Save",
  error,
}) {
  const fields = [
    { label: "Name", key: "name", type: "text" },
    { label: "Description", key: "description", type: "textarea" },
    { label: "Target Days", key: "targetDays", type: "number" },
    { label: "Category ID", key: "categoryId", type: "number" },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card className="shadow-lg border border-customPurple/40">
        <CardHeader className="bg-customPurple/10 rounded-t-xl p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-customPurple text-xl tracking-wide">
                {header}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {editable
                  ? "You can edit your habit details below"
                  : "Here are your habit details"}
              </CardDescription>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">
                  {habit.createdAt
                    ? new Date(habit.createdAt).toLocaleString()
                    : ""}
                </span>
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {fields.map(({ label, key, type }) => (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <Label className="sm:w-1/3">{label}:</Label>
              <div className="sm:w-2/3">
                {editable ? (
                  type === "textarea" ? (
                    <Textarea
                      className="resize-none w-full border-customPurple/40"
                      value={habit[key]}
                      onChange={(e) => onChange(key, e.target.value)}
                    />
                  ) : (
                    <Input
                      type={type}
                      className="w-full border-customPurple/40"
                      value={habit[key]}
                      onChange={(e) =>
                        onChange(
                          key,
                          type === "number"
                            ? Number(e.target.value)
                            : e.target.value
                        )
                      }
                    />
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {habit[key] || "—"}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Status Field */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Label className="sm:w-1/3">Status:</Label>
            <div className="sm:w-2/3">
              {editable ? (
                <Select
                  value={habit.status}
                  onValueChange={(value) => onChange("status", value)}
                >
                  <SelectTrigger className="w-full border-customPurple/40">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="on hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="capitalize text-sm text-muted-foreground">
                  {habit.status}
                </p>
              )}
            </div>
          </div>

          {/* End Date Field */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Label className="sm:w-1/3">End Date:</Label>
            <div className="sm:w-2/3">
              {editable ? (
                <Input
                  type="date"
                  className="w-full border-customPurple/40"
                  value={habit.endDate ? habit.endDate.slice(0, 10) : ""}
                  onChange={(e) =>
                    onChange("endDate", e.target.value || null)
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {habit.endDate
                    ? new Date(habit.endDate).toLocaleDateString()
                    : "No end date"}
                </p>
              )}
            </div>
          </div>

          {/* Action Button */}
          {editable && (
            <div className="flex gap-4 mt-4">
              <Button onClick={onSubmit} disabled={loading}>
                {loading ? "Saving..." : actionLabel}
              </Button>
              {error && (
                <span className="text-red-500 text-sm self-center">
                  {error}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}