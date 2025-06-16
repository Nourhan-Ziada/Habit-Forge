import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HabitCard } from "../components/HabitCard";
import { habitsService } from "@/services/habitsService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { HabitTable } from "../components/HabitTable";

export default function DashboardPage() {
  const [habits, setHabits] = useState([]);
  const [ allHabits, setAllHabits] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const data = await habitsService.getHabitsWithTodayStatus();
        setHabits(data);
        const allHabitsData = await habitsService.getHabits();
        setAllHabits(allHabitsData);
        console.log("Habits fetched successfully:", allHabitsData);

      } catch (error) {
        console.error("Failed to fetch habits:", error);
      }
    };

    fetchHabits();
  }, []);
  const handleToggleHabit = async (id) => {
    try {
      const habitToToggle = habits.find((h) => h.id === id);
      if (!habitToToggle) return;

      await habitsService.toggleHabitCompletion({
        habitId: id,
        completed: !habitToToggle.completed,
      });

      const updatedHabits = habits.map((habit) =>
        habit.id === id
          ? { ...habit, completed: !habitToToggle.completed }
          : habit
      );

      setHabits(updatedHabits);
    } catch (error) {
      console.error("Failed to toggle habit:", error);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Today</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </header>
              <div className="grid auto-rows-min gap-4 md:grid-cols-3 m-4">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={{
                      id: habit.id,
                      name: habit.name,
                      completed: habit.completed,
                    }}
                    onToggle={handleToggleHabit}
                    onView={() => {
                      //fetch the full habit details if needed
                      habitsService
                        .getHabitById(habit.id)
                        .then((fullHabit) => {
                          navigate(`/habits/${habit.id}`, {
                            state: { habit: fullHabit, editable: false },
                          });
                        })
                        .catch((error) =>
                          console.error("Failed to fetch habit details:", error)
                        );
                    }}
                    onEdit={() => {
                      habitsService
                        .getHabitById(habit.id)
                        .then((fullHabit) => {
                          navigate(`/habits/${habit.id}`, {
                            state: { habit: fullHabit, editable: true },
                          });
                        })
                        .catch((error) =>
                          console.error("Failed to fetch habit details:", error)
                        );
                    }}
                  />
                ))}
              </div>
              <HabitTable habits={allHabits} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
