import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

export default function StudyPage() {
  const TOTAL_TIME = 30 * 60; // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Format seconds as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Start the timer
  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  // Stop/pause the timer
  const handleStop = () => {
    setIsRunning(false);
  };

  // Countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Reset when finished
  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      alert("Time's up! Take a break.");
    }
  }, [timeLeft]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "5rem", marginBottom: "2rem" }}>
        {formatTime(timeLeft)}
      </h1>

      <div>
        {isRunning ? (
          <Button variant="danger" onClick={handleStop} style={{ fontSize: "1.5rem", marginRight: "1rem" }}>
            Stop
          </Button>
        ) : (
          <Button variant="success" onClick={handleStart} style={{ fontSize: "1.5rem", marginRight: "1rem" }}>
            Start
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={() => setTimeLeft(TOTAL_TIME)}
          style={{ fontSize: "1.5rem" }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
