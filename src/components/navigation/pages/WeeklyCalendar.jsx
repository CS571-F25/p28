import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import TaskCard from "../../TaskCard";

export default function WeeklyCalendar() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Each day has its own task list
  const [tasks, setTasks] = useState(Array(7).fill([]));
  const [newTask, setNewTask] = useState(Array(7).fill(""));

  const handleAddTask = (dayIndex) => {
    if (!newTask[dayIndex].trim()) return;
    const updatedTasks = [...tasks];
    updatedTasks[dayIndex] = [...updatedTasks[dayIndex], { title: newTask[dayIndex] }];
    setTasks(updatedTasks);

    const updatedNewTask = [...newTask];
    updatedNewTask[dayIndex] = "";
    setNewTask(updatedNewTask);
  };

  const handleDeleteTask = (dayIndex, taskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[dayIndex] = updatedTasks[dayIndex].filter((_, i) => i !== taskIndex);
    setTasks(updatedTasks);
  };

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1rem", overflowX: "auto" }}>
      {days.map((day, dayIndex) => (
        <div key={dayIndex} style={{ flex: "1 0 150px" }}>
          <h5 style={{ textAlign: "center" }}>{day}</h5>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask(dayIndex);
            }}
          >
            <Form.Group className="mb-1">
              <Form.Control
                size="sm"
                type="text"
                placeholder="New task"
                value={newTask[dayIndex]}
                onChange={(e) => {
                  const updated = [...newTask];
                  updated[dayIndex] = e.target.value;
                  setNewTask(updated);
                }}
              />
            </Form.Group>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleAddTask(dayIndex)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            >
              Add
            </Button>
          </Form>

          {tasks[dayIndex].map((task, taskIndex) => (
            <TaskCard
              key={taskIndex}
              title={task.title}
              onDelete={() => handleDeleteTask(dayIndex, taskIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
