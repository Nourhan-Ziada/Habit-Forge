import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react"; // icon for ⋮
import { cn } from "@/lib/utils";

export function HabitCard({
  habit,
  onToggle,
  onView,
  onEdit,
  className,
  ...props
}) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{habit.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={habit.completed}
              onCheckedChange={() => onToggle(habit.id)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical className="w-5 h-5 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onView(habit.id)}>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(habit.id)}>
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>{habit.description}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  );
}
