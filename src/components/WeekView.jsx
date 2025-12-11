import { useMemo } from "react";

/**
 * WeekView
 * 
 * A reusable week view component that displays tasks organized by day.
 * 
 * @param {Array} tasks - Array of task objects with dueDate property (YYYY-MM-DD format)
 * @param {Date} selectedDate - The date within the week to display
 * @param {Function} renderTask - Function to render each task (receives task object)
 * @param {Object} style - Optional styles for the container
 */
export default function WeekView({ 
  tasks = [], 
  selectedDate = new Date(),
  renderTask = (task) => <div>{task.title}</div>,
  style = {}
}) {
  // Utility: format Date -> "YYYY-MM-DD" (matches <input type="date">)
  const toISODate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Week range based on selected date (Sunday–Saturday)
  const weekInfo = useMemo(() => {
    const base = new Date(selectedDate);
    const start = new Date(base);
    start.setHours(0, 0, 0, 0);
    start.setDate(base.getDate() - base.getDay()); // move back to Sunday

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }

    const end = new Date(days[6]);
    end.setHours(23, 59, 59, 999);

    return { start, end, days };
  }, [selectedDate]);

  // Tasks that fall within the selected week (based on dueDate)
  const tasksByDate = useMemo(() => {
    const map = {};
    for (const d of weekInfo.days) {
      map[toISODate(d)] = [];
    }

    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const key = t.dueDate;
      if (map[key]) map[key].push(t);
    });

    return map;
  }, [tasks, weekInfo]);

  const formatDayHeading = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
        {weekInfo.days.map((d) => {
          const iso = toISODate(d);
          const dayTasks = tasksByDate[iso] || [];
          return (
            <div
              key={iso}
              style={{
                marginBottom: 12,
                borderBottom: "1px dashed var(--color-border-light)",
                paddingBottom: 8,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  marginBottom: 4,
                }}
              >
                {formatDayHeading(d)}
              </div>
              {dayTasks.length === 0 ? (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  No tasks
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {dayTasks.map((task) => (
                    <div key={task.id}>
                      {renderTask(task)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}