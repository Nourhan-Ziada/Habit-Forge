import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

export function Calendar07({ dateRange, setDateRange }) {
  return (
    <div className="flex items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="p-2" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
