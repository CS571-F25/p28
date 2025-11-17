import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import TaskCard from "../../TaskCard"

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });


const handleAddTask = () => {
  if (!newTask.title.trim()) return;

  setTasks([...tasks, { ...newTask }]); 
  setNewTask({ title: "", description: "", dueDate: "" }); 
};


  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "2rem" }}>
      {/* Left content */}
      <div style={{ flex: 1 }}>
        <h1>Home Page</h1>
        <p>Welcome! This is the main content area.</p>
      </div>

      {/* Right task column */}
      <div style={{ flex: 1, marginLeft: "2rem" }}>
        <h2>To-Do Tasks</h2>
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

        <Form.Group className="mb-2">
          <Form.Control
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
        </Form.Group>

        <Button variant="primary" type="submit">Add Task</Button>
      </Form>

        {tasks.map((task, index) => (
          <TaskCard
            key={index}
            title={task.title}
            description={task.description}
            dueDate={task.dueDate}
            onDelete={() => handleDeleteTask(index)}
          />
        ))}
      </div>
    </div>
  );
}
