import { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import StudyTrack from "../../StudyTrack";

export default function StudyPage() {
  const INITIAL_MINUTES = 30;
  const INITIAL_TOTAL_TIME = INITIAL_MINUTES * 60; // seconds

  const [totalTimeSec, setTotalTimeSec] = useState(INITIAL_TOTAL_TIME);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TOTAL_TIME);
  const [minutesInput, setMinutesInput] = useState(INITIAL_MINUTES);
  const [isRunning, setIsRunning] = useState(false);
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

  return (
    <div
      style={{
        display: "flex",
        minHeight: "80vh",
        fontFamily: "sans-serif",
      }}
    >
      {/* Left side: main timer + controls */}
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
        <h1 style={{ fontSize: "5rem", marginBottom: "1rem" }}>
          {formatTime(timeLeft)}
        </h1>

        {/* Session length input */}
        <div style={{ marginBottom: "0.5rem", textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.9rem",
              marginBottom: "0.25rem",
            }}
          >
            Session length (minutes)
          </div>
          <Form.Control
            type="number"
            min={1}
            value={minutesInput}
            onChange={handleMinutesChange}
            style={{ maxWidth: "120px", margin: "0 auto", color: "var(--color-secondary)",backgroundColor: "var(--color-background)" }}
          />
          <small style={{ color: "#6b7280" }}>
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
  );
}
