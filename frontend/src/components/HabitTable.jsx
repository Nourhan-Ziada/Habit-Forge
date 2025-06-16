import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; // common icon from lucide

export function HabitTable({ data }) {
  const [habits, setHabits] = useState(data || []);

  const columns = [
    {
      accessorKey: "name",
      header: () => <div className="text-left">Name</div>,
      cell: ({ row }) => (
        <div className="text-left font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: () => <div className="text-left">Description</div>,
      cell: ({ row }) => (
        <div className="text-left text-muted-foreground">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => (
        <div className="text-left capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-left">Created At</div>,
      cell: ({ row }) => (
        <div className="text-left">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: () => <div className="text-left">End Date</div>,
      cell: ({ row }) => (
        <div className="text-left">
          {row.getValue("endDate")
            ? new Date(row.getValue("endDate")).toLocaleDateString()
            : "N/A"}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: habits,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const filterByStatus = (status) => {
    const filteredHabits = data.filter((habit) => habit.status === status);
    setHabits(filteredHabits);
  };

  const handleAddHabit = () => {
    // Placeholder logic - replace with modal or form
    const newHabit = {
      id: habits.length + 1,
      name: "New Habit",
      description: "Description here...",
      status: "active",
      createdAt: new Date().toISOString(),
      endDate: null,
    };
    setHabits([...habits, newHabit]);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Habits</h2>
          <Button
            onClick={handleAddHabit}
            size="icon"
            variant="outline"
            className="w-8 h-8"
            title="Add New Habit"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          {["active", "completed", "archived", "on hold"].map((status) => (
            <Button
              key={status}
              variant="outline"
              onClick={() => filterByStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-left">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
