import { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import StudyTrack from "../../StudyTrack";
import TaskCard from "../../TaskCard";
import { useAuth } from "../../../contexts/AuthContext";

export default function StudyPage() {
  const auth = useAuth();
  const INITIAL_MINUTES = 30;
  const INITIAL_TOTAL_TIME = INITIAL_MINUTES * 60; // seconds

  const [totalTimeSec, setTotalTimeSec] = useState(INITIAL_TOTAL_TIME);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TOTAL_TIME);
  const [minutesInput, setMinutesInput] = useState(INITIAL_MINUTES);
  const [isRunning, setIsRunning] = useState(false);
  const [studySessionTasks, setStudySessionTasks] = useState([]);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = () => {
    if (!isRunning && timeLeft > 0) setIsRunning(true);
  };

  const handleStop = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(totalTimeSec);
  };

  // User changes the session length (in minutes)
  const handleMinutesChange = (e) => {
    const value = e.target.value;
    setMinutesInput(value);

    const minutes = parseFloat(value);
    if (isNaN(minutes) || minutes <= 0) return;

    // Convert to seconds and snap to nearest 30 seconds
    let seconds = minutes * 60;
    const SNAP = 30;
    seconds = Math.max(SNAP, Math.round(seconds / SNAP) * SNAP);

    // Stop timer and reset with new duration
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTotalTimeSec(seconds);
    setTimeLeft(seconds);
  };

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      alert("Time's up! Take a break.");
    }
  }, [timeLeft, isRunning]);

  useEffect(() => {
    if (auth.user) {
      setStudySessionTasks(auth.getStudySessionTasks() || []);
    } else {
      setStudySessionTasks([]);
    }
  }, [auth.user]);

  const handleRemoveFromStudySession = (taskId) => {
    if (!auth.user) return;
    const updated = auth.removeTaskFromStudySession(taskId);
    setStudySessionTasks(updated);
  };

  const handleCompleteFromStudySession = (taskId) => {
    if (!auth.user) return;
    // Remove from study session
    const updated = auth.removeTaskFromStudySession(taskId);
    setStudySessionTasks(updated);
    // Mark as complete in main tasks
    auth.completeTaskById(taskId);
  };

  const handleClearStudySession = () => {
    if (!auth.user) return;
    if (window.confirm("Clear all tasks from study session?")) {
      auth.clearStudySession();
      setStudySessionTasks([]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "80vh",
        fontFamily: "sans-serif",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {/* Left sidebar: Study session tasks */}
      <div
        style={{
          width: "280px",
          background: "var(--color-background)",
          border: "1px solid var(--color-border)",
          borderRadius: 8,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-text)" }}>Study Tasks</h3>
        {studySessionTasks.length === 0 ? (
          <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
            Add tasks to focus on them during this session
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
            {studySessionTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                dueDate={task.dueDate}
                compact={true}
                showDescription={false}
                inlineActions={true}
                onComplete={() => handleCompleteFromStudySession(task.id)}
                onDelete={() => handleRemoveFromStudySession(task.id)}
                color={task.color}
              />
            ))}
          </div>
        )}
        {studySessionTasks.length > 0 && (
          <Button
            size="sm"
            variant="danger"
            onClick={handleClearStudySession}
            style={{ marginTop: "1rem" }}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Center & Right: Timer and track */}
      <div style={{ flex: 1, display: "flex", gap: "1rem" }}>
        {/* Center: main timer + controls */}
        <div
          style={{
            flex: 1,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
        <h1 style={{ fontSize: "5rem", marginBottom: "1rem", color: "var(--color-text)" }}>
          {formatTime(timeLeft)}
        </h1>

        {/* Session length input */}
        <div style={{ marginBottom: "0.5rem", textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.9rem",
              marginBottom: "0.25rem",
              color: "var(--color-text)",
            }}
          >
            Session length (minutes)
          </div>
          <Form.Control
            type="number"
            min={1}
            value={minutesInput}
            onChange={handleMinutesChange}
            style={{ maxWidth: "120px", margin: "0 auto", color: "var(--color-text-on-light)", backgroundColor: "var(--color-secondary)" }}
          />
          <small style={{ color: "var(--color-text-muted)" }}>
            snapped to nearest 30 seconds
          </small>
        </div>

        <div>
          {isRunning ? (
            <Button
              variant="danger"
              onClick={handleStop}
              style={{ fontSize: "1.5rem", marginRight: "1rem" }}
            >
              Stop
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleStart}
              style={{ fontSize: "1.5rem", marginRight: "1rem" }}
              disabled={timeLeft === 0}
            >
              Start
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={handleReset}
            style={{ fontSize: "1.5rem" }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Right side: track visualizer */}
      <div
        style={{
          flex: 1,
          background: "var(--color-background)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1.5rem",
        }}
      >
        <StudyTrack
          totalTimeSec={totalTimeSec}
          timeLeft={timeLeft}
          isRunning={isRunning}
        />
      </div>
      </div>
    </div>
  );
}