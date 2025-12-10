import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import TaskCard from "../../TaskCard";
import { useAuth } from "../../../contexts/AuthContext";

export default function HomePage() {
  const auth = useAuth();
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    color: "#ffffff",   // class color
    className: "",      // new field
  });

  useEffect(() => {
    if (auth.user) setTasks(auth.getTasks());
    else setTasks([]);
  }, [auth.user]);

  useEffect(() => {
    if (auth.user) {
      const cols = auth.getColumns() || [];
      if (!cols || cols.length === 0) {
        const initial = [{ id: `col-${Date.now()}`, title: "Add Title Here", color: "#ffffff" }];
        auth.setColumns(initial);
        setColumns(initial);
      } else setColumns(cols);
    } else setColumns([]);
  }, [auth.user]);

  const handleAddTab = () => {
    if (!auth.user) return alert("Please log in to add a tab.");
    // limit to 8 tabs
    if ((columns || []).length >= 8) return alert("Maximum of 8 tabs allowed.");
    const newCol = { id: `col-${Date.now()}`, title: "New Tab", color: "#ffffff" };
    const updated = [...(columns || []), newCol];
    setColumns(updated);
    auth.setColumns(updated);
  };

  const handleDeleteTab = (colId) => {
    if (!auth.user) return alert("Please log in to modify tabs.");
    const updatedCols = (columns || []).filter((c) => c.id !== colId);

    const existing = auth.getTasks();
    // When deleting a class/column, clear the status for tasks that used it
    const updatedTasks = existing.map((t) =>
      t.status === colId ? { ...t, status: null } : t
    );

    auth.setTasks(updatedTasks);
    setTasks(updatedTasks);
    setColumns(updatedCols);
    auth.setColumns(updatedCols);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    if (!auth.user) return alert("Please log in to save tasks to your account.");

    const className = (newTask.className || "").trim();
    const classColor = newTask.color || "#ffffff";

    let updatedColumns = columns || [];
    let classColumn = null;
    let status = null;

    // If a class name is provided, ensure a column (class) exists for it
    if (className) {
      classColumn = updatedColumns.find(
        (c) => c.title.toLowerCase() === className.toLowerCase()
      );

      if (!classColumn) {
        classColumn = {
          id: `col-${Date.now()}`,
          title: className,
          color: classColor,
        };
        updatedColumns = [...updatedColumns, classColumn];
        setColumns(updatedColumns);
        auth.setColumns(updatedColumns);
      }
      status = classColumn.id;
    }

    // New tasks start attached to their class column (if given), otherwise unsorted
    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      status,                 // column id if class given
      color: classColor,      // use class color for the task
      className: className,   // store class name on the task as well
    };

    const updated = auth.addTask(task);
    setTasks(updated);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      color: "#ffffff",
      className: "",
    });
  };

  const handleCompleteTask = (id) => {
    if (!auth.user) return;
    const updated = auth.completeTaskById(id);
    setTasks(updated);
  };

  const handleDeleteTask = (id) => {
    if (!auth.user) return;
    const existing = auth.getTasks();
    const idx = existing.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const updated = auth.deleteTask(idx);
    setTasks(updated);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData("text/plain");
    if (!idStr) return;
    const id = Number(idStr);
    const updated = auth.updateTaskById(id, { status: newStatus });
    setTasks(updated);
  };

  const allowDrop = (e) => e.preventDefault();

  // Only return tasks that are explicitly assigned to the given column id
  const byStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "2.5rem" }}>
      {/* Add Task box */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 1100, display: 'flex', gap: 16 }}>
          {/* Add Task column (left) */}
          <div style={{ flex: 2, background: "var(--color-background-alt)", border: "1px solid var(--color-primary)", padding: "1rem 1.25rem", borderRadius: 8 }}>
            <h4 style={{ textAlign: "center", marginTop: 0 }}>Add Task</h4>
            <Form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </Form.Group>

              {/* New: Class name */}
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Class (optional)"
                  value={newTask.className}
                  onChange={(e) => setNewTask({ ...newTask, className: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Control
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ margin: 0 }}>Class color:</label>
                <input
                  type="color"
                  value={newTask.color || '#ffffff'}
                  onChange={(e) => setNewTask({ ...newTask, color: e.target.value })}
                />
              </Form.Group>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button variant="primary" type="submit">Add Task</Button>
              </div>
            </Form>
          </div>

          {/* Unsorted Tasks column (right) */}
          <div style={{ flex: 1 }}>
            <div style={{ background: "var(--color-background-alt)", border: "1px solid", padding: 12, borderRadius: 8 }}>
              <h5 style={{ marginTop: 0, marginBottom: 8, color: '#666' }}>Unsorted Tasks</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
                {(() => {
                  const unsorted = tasks.filter((t) => !columns.find((c) => c.id === t.status));
                  return unsorted.length ? unsorted.map((task) => (
                    <TaskCard
                      key={task.id}
                      title={task.title}
                      description={task.description}
                      dueDate={task.dueDate}
                      onDelete={() => handleDeleteTask(task.id)}
                      onComplete={() => handleCompleteTask(task.id)}
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", String(task.id))}
                      color={task.color}
                    />
                  )) : <div style={{ color: '#666' }}>No unsorted tasks</div>;
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs area (now Classes) */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 1100, background: "var(--color-primary)", border: "1px solid #647994ff", padding: "1rem", borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>Classes</h2>
            <Button size="sm" onClick={handleAddTab}>Add Class</Button>
          </div>

          {/* Tabs list — horizontally scrollable when many tabs */}
          <div style={{ overflowX: "auto", width: "100%", paddingBottom: 8 }}>
            <div style={{ display: "flex", gap: "1.25rem", width: "max-content" }}>
              {columns.map((col) => (
                <div
                  key={col.id}
                  onDragOver={allowDrop}
                  onDrop={(e) => handleDrop(e, col.id)}
                  style={{ minWidth: 260, minHeight: 200, background: "var(--color-secondary)", borderTop: `${col.color} solid 4px` || "#ffffff", padding: "0.75rem", borderRadius: 6 }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8, marginRight: 24 }}>
                    <input
                      value={col.title}
                      onChange={(e) => {
                        const updated = columns.map((c) => (c.id === col.id ? { ...c, title: e.target.value } : c));
                        setColumns(updated);
                        auth.setColumns(updated);
                      }}
                      style={{ textAlign: "center", border: "none", background: "transparent", fontSize: 16, fontWeight: 600 }}
                    />
                    <div style={{ marginLeft: 6 }}>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteTab(col.id)}>Delete</Button>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {byStatus(col.id).map((task) => (
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        description={task.description}
                        dueDate={task.dueDate}
                        onDelete={() => handleDeleteTask(task.id)}
                        onComplete={() => handleCompleteTask(task.id)}
                        draggable={true}
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", String(task.id))}
                        color={task.color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
