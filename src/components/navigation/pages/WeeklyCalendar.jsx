import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import TaskCard from "../../TaskCard";
import { useAuth } from "../../../contexts/AuthContext";

export default function WeeklyCalendar() {
  const auth = useAuth();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedDay, setSelectedDay] = useState(days[0]);

  useEffect(() => {
    if (auth.user) setTasks(auth.getTasks() || []);
    else setTasks([]);
  }, [auth.user]);

  const allowDrop = (e) => e.preventDefault();

  const handleDropToDay = (e, dayName) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData("text/plain");
    if (!idStr) return;
    const id = Number(idStr);
    const updated = auth.updateTaskById(id, { day: dayName });
    setTasks(updated);
  };

  const handleAssignSelected = () => {
    if (!selectedTaskId) return;
    const id = Number(selectedTaskId);
    const updated = auth.updateTaskById(id, { day: selectedDay });
    setTasks(updated);
    setShowAddTask(false);
    setSelectedTaskId("");
  };

  // tasks assigned to a given day
  const tasksForDay = (dayName) => tasks.filter((t) => t.day === dayName);

  return (
    <Container fluid style={{ padding: 0, minHeight: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header: title + Add Task button (opens selector) */}
        <div style={{ borderBottom: '1px solid #e6e6e6', padding: 12, background: '#f5f7fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, color: '#333' }}>Weekly Calendar</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button onClick={() => setShowAddTask((s) => !s)} variant="primary">Add Task</Button>
          </div>
        </div>

        {/* Add Task selector panel */}
        {showAddTask && (
          <div style={{ padding: 12, background: '#fff', borderBottom: '1px solid #eee', display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ color: '#666' }}>Select task:</label>
            <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)} style={{ minWidth: 220, padding: 6 }}>
              <option value="">-- choose a task --</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>{t.title}{t.day ? ` (on ${t.day})` : ''}</option>
              ))}
            </select>

            <label style={{ color: '#666' }}>Day:</label>
            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{ padding: 6 }}>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <Button variant="success" onClick={handleAssignSelected} disabled={!selectedTaskId}>Assign</Button>
            <Button variant="outline-secondary" onClick={() => { setShowAddTask(false); setSelectedTaskId(""); }}>Cancel</Button>
          </div>
        )}

        {/* Calendar grid */}
        <div style={{ flex: 1, padding: 12, overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 12, width: '100%', height: '100%' }}>
            {days.map((d) => (
              <div key={d} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 8, background: '#fff', minWidth: 0, display: 'flex', flexDirection: 'column', maxHeight: '100%' }} onDragOver={allowDrop} onDrop={(e) => handleDropToDay(e, d)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ color: '#666' }}>{d}</strong>
                  <Button size="sm" variant="outline-secondary" onClick={() => {
                    // unassign all tasks from this day
                    const updated = tasks.map((t) => (t.day === d ? { ...t, day: null } : t));
                    auth.setTasks(updated);
                    setTasks(updated);
                  }}>Clear</Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
                  {tasksForDay(d).map((task) => (
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        // hide description in calendar view and use compact/tiny styling
                        description={task.description}
                        showDescription={false}
                        compact={true}
                        tiny={true}
                        inlineActions={true}
                        onDelete={() => { const idx = auth.getTasks().findIndex((t) => t.id === task.id); auth.deleteTask(idx); setTasks(auth.getTasks()); }}
                        onComplete={() => { const updated = auth.completeTaskById(task.id); setTasks(updated); }}
                        draggable={true}
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', String(task.id))}
                        color={task.color}
                      />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
