import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { HabitDetails } from "@/components/HabitDetails";
import { Calendar07 } from "@/components/Calendar07";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { ChartLineDefault } from "../components/Chart-line-default";
import { habitsService } from "@/services/habitsService";
import { ChartPieLegend } from "@/components/Pie-Chart-Legend";
import { CompletionBarChart } from "@/components/CompletionBarChart";

export default function HabitDetailsPage() {
  const location = useLocation();
  const { habit } = location.state || {};
  const { editable } = location.state || false;

  const [editableHabit, setEditableHabit] = useState(habit);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [dateRange, setDateRange] = useState({ from: startOfMonth, to: today });

  const [habitStats, setHabitStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEditableHabit(habit);
  }, [habit]);

  useEffect(() => {
    if (!habit || editable) return;

    setLoading(true);
    habitsService
      .getHabitStats(habit.id, dateRange.from, dateRange.to)
      .then((stats) => {
        setHabitStats(stats);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch habit stats:", error);
        setLoading(false);
      });
  }, [habit, dateRange, editable]);

  if (!habit) {
    return <div className="p-4">No habit selected.</div>;
  }

  const handleFieldChange = (key, value) => {
    setEditableHabit((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await habitsService.updateHabit(editableHabit.id, editableHabit);
    } catch (error) {
      setSaveError(`Failed to save changes: ${error.message}`);
    }
    setSaving(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto relative">
      <h1 className="text-2xl font-semibold">Habit Details</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-customPurple/40 flex justify-center">
  <div className="w-full max-w-4xl">
    <HabitDetails
      habit={editableHabit}
      editable={editable}
      onChange={handleFieldChange}
    />

    {editable && (
      <div className="flex gap-4 mt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {saveError && (
          <span className="text-red-500 text-sm self-center">
            {saveError}
          </span>
        )}
      </div>
    )}
  </div>
</div>


      {/* Only show stats/charts if not editable */}
      {!editable && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Stats</h2>
            <div className="relative" ref={calendarRef}>
              <Button
                variant="outline"
                onClick={() => setShowCalendar((prev) => !prev)}
                className="flex items-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" />
                {showCalendar ? "Hide Calendar" : "Select Date Range"}
              </Button>
              {showCalendar && (
                <div className="absolute z-50 mt-2 right-0">
                  <Calendar07
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                  />
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Showing data from{" "}
            <strong>{dateRange.from?.toLocaleDateString()}</strong> to{" "}
            <strong>{dateRange.to?.toLocaleDateString()}</strong>
          </p>

          {loading ? (
            <p className="text-muted-foreground">Loading stats...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ChartLineDefault
                title="Completion Over Time"
                data={habitStats?.dailyCompletion || []}
              />
              <ChartPieLegend
                pieChartData={{
                  completed: habitStats?.pieChartData?.completed || 0,
                  notCompleted: habitStats?.pieChartData?.notCompleted || 0,
                }}
              />
              <CompletionBarChart
                title="Completion Percentage"
                completionPercentage={habitStats?.completionPercentage || 0}
              />

              {/* Future charts can go here */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
