import { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import checkCircleIcon from "../assets/check-circle.svg";
import plusCircleIcon from "../assets/plus-circle.svg";
import trashIcon from "../assets/trash.svg";

export default function TaskCard({
  title,
  description,
  dueDate,
  onDelete,
  onComplete,
  draggable,
  onDragStart,
  color,
  compact = false,
  tiny = false,
  inlineActions = false,
  showDescription = true,
  onAddToStudy,
  isInStudySession = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const className = (tiny || compact) ? "task-card-slim" : undefined;

  const useMenu = (compact || tiny) && !inlineActions;

  return (
    <Card
      className={className}
      style={{
        marginBottom: tiny ? "0.125rem" : compact ? "0.375rem" : "0.5rem",
        cursor: draggable ? "grab" : "default",
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onMouseEnter={() => (compact || tiny) && setMenuOpen(true)}
      onMouseLeave={() => (compact || tiny) && setMenuOpen(false)}
    >
      <Card.Body className="d-flex flex-column p-2" style={{ minHeight: "auto" }}>
        {/* Top section: title, description, dueDate */}
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="d-flex align-items-center gap-2">
            {/* Left side: color flag + title */}
            <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
              {color && (
                <span
                  aria-hidden="true"
                  style={{
                    width: tiny ? 8 : 10,
                    height: tiny ? 8 : 10,
                    borderRadius: "50%",
                    backgroundColor: color,
                    flexShrink: 0,
                    boxShadow: "0 0 2px rgba(0,0,0,0.25)",
                    marginRight: "0.375rem",
                  }}
                />
              )}
              <span
                style={{
                  fontWeight: tiny || compact ? 600 : "bold",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: tiny ? "0.9rem" : compact ? "0.95rem" : "1rem",
                }}
              >
                {title}
              </span>
            </div>
          </div>

          {showDescription && description && !compact && !tiny && (
            <small className="d-block mt-1 text-muted">{description}</small>
          )}

          {dueDate && !tiny && (
            <small className="d-block mt-1 text-secondary">Due: {dueDate}</small>
          )}
        </div>

        {/* Bottom section: action buttons */}
        <div className="d-flex justify-content-end gap-2 mt-2">
          {useMenu ? (
            <div className="position-relative">
              <button
                aria-label="open menu"
                className="btn btn-link p-0"
                onClick={() => setMenuOpen((s) => !s)}
                style={{ fontSize: tiny ? 12 : 16 }}
              >
                ⋯
              </button>
              {menuOpen && (
                <div
                  className="position-absolute end-0 border rounded mt-2 bg-white shadow-sm"
                  style={{
                    zIndex: 1000,
                    minWidth: "120px",
                  }}
                >
                  <div className="d-flex flex-column">
                    {onComplete && (
                      <button
                        onClick={() => {
                          onComplete();
                          setMenuOpen(false);
                        }}
                        className="btn btn-link text-start text-body p-2 text-decoration-none border-0"
                        title="Mark as complete"
                      >
                        Complete
                      </button>
                    )}
                    {onAddToStudy && (
                      <button
                        onClick={() => {
                          if (!isInStudySession) {
                            onAddToStudy();
                            setMenuOpen(false);
                          }
                        }}
                        disabled={isInStudySession}
                        className="btn btn-link text-start text-body p-2 text-decoration-none border-0"
                        style={{ opacity: isInStudySession ? 0.5 : 1, cursor: isInStudySession ? "not-allowed" : "pointer" }}
                        title={isInStudySession ? "Already in study session" : "Add to study session"}
                      >
                        Add to Study
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete();
                          setMenuOpen(false);
                        }}
                        className="btn btn-link text-start text-danger p-2 text-decoration-none border-0"
                        title="Delete task"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="d-flex gap-2">
              {onComplete && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={onComplete}
                  className="p-1"
                  title="Mark as complete"
                >
                  <img src={checkCircleIcon} alt="complete" style={{ width: 16, height: 16 }} />
                </Button>
              )}
              {onAddToStudy && (
                <Button
                  variant={isInStudySession ? "secondary" : "info"}
                  size="sm"
                  onClick={onAddToStudy}
                  disabled={isInStudySession}
                  className="p-1"
                  style={{ opacity: isInStudySession ? 0.6 : 1 }}
                  title={isInStudySession ? "Already in study session" : "Add to Study Session"}
                >
                  <img src={plusCircleIcon} alt="add to study" style={{ width: 16, height: 16 }} />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onDelete}
                  className="p-1"
                  title="Delete task"
                >
                  <img src={trashIcon} alt="delete" style={{ width: 16, height: 16 }} />
                </Button>
              )}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
