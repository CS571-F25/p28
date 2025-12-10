import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import TaskCard from "../../TaskCard";
import { useAuth } from "../../../contexts/AuthContext";
import paintBucketIcon from "../../../assets/paint-bucket.svg";
import trashIcon from "../../../assets/trash.svg";

export default function HomePage() {
  const auth = useAuth();
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [studySessionTasks, setStudySessionTasks] = useState([]);
  const [openColorPickerId, setOpenColorPickerId] = useState(null);
  const [editingTitleTabId, setEditingTitleTabId] = useState(null);
  const [addingTaskToTabId, setAddingTaskToTabId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    color: "#992800",
  });

  useEffect(() => {
    if (auth.user) setTasks(auth.getTasks());
    else setTasks([]);
  }, [auth.user]);

  useEffect(() => {
    if (auth.user) {
      setStudySessionTasks(auth.getStudySessionTasks() || []);
    } else {
      setStudySessionTasks([]);
    }
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
    if (!addingTaskToTabId) return;

    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      status: addingTaskToTabId,
      color: newTask.color || "#992800",
    };

    const updated = auth.addTask(task);
    setTasks(updated);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      color: "#992800",
    });
    setAddingTaskToTabId(null);
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

  const handleAddTaskToStudy = (id) => {
    if (!auth.user) return alert("Please log in to add tasks to study session.");
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updated = auth.addTaskToStudySession(task);
      setStudySessionTasks(updated);
    }
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
      {/* Tabs area */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 1200, background: "var(--color-primary)", border: "1px solid #647994ff", padding: "1.5rem", borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Tabs</h2>
            <Button size="sm" onClick={handleAddTab}>Create Tab</Button>
          </div>

          {/* No tabs message */}
          {(!columns || columns.length === 0) && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#666", fontSize: "1.1rem" }}>
              Create a tab to start!
            </div>
          )}

          {/* Tabs grid */}
          {columns && columns.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {columns.map((col) => (
                <div
                  key={col.id}
                  onDragOver={allowDrop}
                  onDrop={(e) => handleDrop(e, col.id)}
                  style={{
                    background: "var(--color-secondary)",
                    borderTop: `${col.color} solid 6px`,
                    borderRadius: 8,
                    padding: "1rem",
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  {/* Tab header with title and color picker */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12, position: "relative" }}>
                    {editingTitleTabId === col.id ? (
                      <input
                        autoFocus
                        value={col.title}
                        onChange={(e) => {
                          const updated = columns.map((c) => (c.id === col.id ? { ...c, title: e.target.value } : c));
                          setColumns(updated);
                          auth.setColumns(updated);
                        }}
                        onBlur={() => setEditingTitleTabId(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setEditingTitleTabId(null);
                        }}
                        style={{
                          flex: 1,
                          textAlign: "left",
                          border: "1px solid #ccc",
                          background: "transparent",
                          fontSize: 16,
                          fontWeight: 600,
                          padding: "4px 8px",
                          borderRadius: 4
                        }}
                      />
                    ) : (
                      <h3
                        onClick={() => setEditingTitleTabId(col.id)}
                        style={{
                          flex: 1,
                          margin: 0,
                          cursor: "pointer",
                          padding: "4px 8px",
                          borderRadius: 4,
                          userSelect: "none",
                          color: "#333",
                          fontSize: 16,
                          fontWeight: 600
                        }}
                        title="Click to edit"
                      >
                        {col.title}
                      </h3>
                    )}
                    <button
                      onClick={() => setOpenColorPickerId(openColorPickerId === col.id ? null : col.id)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                        background: "transparent",
                        border: "none",
                        cursor: 'pointer',
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      title="Click to change color"
                    >
                      <img src={paintBucketIcon} alt="color picker" style={{ width: 20, height: 20 }} />
                    </button>
                    {openColorPickerId === col.id && (
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: 8,
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        padding: 8,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        zIndex: 1000,
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        width: 180
                      }}>
                        {['#992800', '#ffaf00', '#fc7942', '#99bd3c', '#4577b8', '#8a50d8', '#ee5091', '#483e62', '#978131', '#5c5c57'].map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              const updated = columns.map((c) => (c.id === col.id ? { ...c, color } : c));
                              setColumns(updated);
                              auth.setColumns(updated);
                              setOpenColorPickerId(null);
                            }}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 3,
                              background: color,
                              border: col.color === color ? '3px solid #000' : '1px solid #ccc',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                    )}
                    <Button size="sm" variant="danger" onClick={() => handleDeleteTab(col.id)} title="Delete tab" style={{ padding: "4px 8px" }}>
                      <img src={trashIcon} alt="delete" style={{ width: 16, height: 16 }} />
                    </Button>
                  </div>

                  {/* Tasks list */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "auto", marginBottom: 12 }}>
                    {byStatus(col.id).map((task) => {
                      const isInStudySession = studySessionTasks.some((st) => st.id === task.id);
                      return (
                        <TaskCard
                          key={task.id}
                          title={task.title}
                          description={task.description}
                          dueDate={task.dueDate}
                          onDelete={() => handleDeleteTask(task.id)}
                          onComplete={() => handleCompleteTask(task.id)}
                          onAddToStudy={() => handleAddTaskToStudy(task.id)}
                          isInStudySession={isInStudySession}
                          draggable={true}
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", String(task.id))}
                          color={task.color}
                        />
                      );
                    })}
                  </div>

                  {/* Add Task form for this tab */}
                  {addingTaskToTabId === col.id ? (
                    <div style={{ borderTop: "1px solid #ddd", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                      <Form.Control
                        type="text"
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Description (optional)"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      />
                      <Form.Control
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {['#992800', '#ffaf00', '#fc7942', '#99bd3c', '#4577b8', '#8a50d8', '#ee5091', '#483e62', '#978131', '#5c5c57'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewTask({ ...newTask, color })}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 3,
                              background: color,
                              border: newTask.color === color ? '3px solid #000' : '1px solid #ccc',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button size="sm" variant="success" onClick={handleAddTask}>Add</Button>
                        <Button size="sm" variant="outline-secondary" onClick={() => setAddingTaskToTabId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline-primary" onClick={() => setAddingTaskToTabId(col.id)} style={{ width: "100%" }}>
                      + Add Task
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
