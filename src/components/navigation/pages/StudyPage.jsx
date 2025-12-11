import { useState, useEffect, useRef } from "react";
import { Button, Form, Container } from "react-bootstrap";
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
    <div className="d-flex gap-3 p-4" style={{ minHeight: "80vh" }}>
      {/* Left sidebar: Study session tasks */}
      <div className="d-flex flex-column gap-3 p-3" style={{ width: "280px", background: "var(--color-background)", border: "1px solid #404040", borderRadius: 8, overflowY: "auto" }}>
        <h3 className="m-0 mb-3" style={{ fontSize: "1.1rem" }}>Study Tasks</h3>
        {studySessionTasks.length === 0 ? (
          <div className="text-muted small" style={{ fontStyle: "italic" }}>
            Add tasks to focus on them during this session
          </div>
        ) : (
          <div className="d-flex flex-column gap-2" style={{ flex: 1 }}>
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
            className="mt-3"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Center & Right: Timer and track */}
      <div className="d-flex flex-grow-1 gap-3">
        {/* Center: main timer + controls */}
        <div className="d-flex flex-column align-items-center justify-content-center gap-4 flex-grow-1 p-5">
        <h1 style={{ fontSize: "5rem", marginBottom: "1rem" }}>
          {formatTime(timeLeft)}
        </h1>

        {/* Session length input */}
        <div className="mb-2 text-center">
          <div className="small mb-2">
            Session length (minutes)
          </div>
          <Form.Control
            type="number"
            min={1}
            value={minutesInput}
            onChange={handleMinutesChange}
            className="mx-auto"
            style={{ maxWidth: "120px", color: "var(--color-secondary)", backgroundColor: "var(--color-background)" }}
          />
          <small className="text-muted">
            snapped to nearest 30 seconds
          </small>
        </div>

        <div className="d-flex gap-3">
          {isRunning ? (
            <Button
              variant="danger"
              onClick={handleStop}
              style={{ fontSize: "1.5rem" }}
            >
              Stop
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleStart}
              style={{ fontSize: "1.5rem" }}
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
      <div className="d-flex justify-content-center align-items-center flex-grow-1 p-4" style={{ background: "var(--color-background)" }}>
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
