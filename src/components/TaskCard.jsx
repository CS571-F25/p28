import { useState } from "react";
import { Card, Button } from "react-bootstrap";
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

  const bodyStyle = tiny
    ? { padding: "0px", display: "flex", flexDirection: "column" }
    : compact
    ? { padding: "0px", display: "flex", flexDirection: "column" }
    : { padding: "4px 6px", display: "flex", flexDirection: "column" };

  const titleStyle = {
    fontWeight: tiny || compact ? 600 : "bold",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: tiny ? "0.9rem" : compact ? "0.95rem" : "1rem",
    marginRight: 0,
  };

  const menuBtnStyle = {
    background: "transparent",
    border: "none",
    padding: tiny ? 1 : 4,
    cursor: "pointer",
    fontSize: tiny ? 12 : 16,
  };

  const useMenu = (compact || tiny) && !inlineActions;

  return (
    <Card
      className={className}
      style={{
        marginBottom: tiny ? "0.125rem" : compact ? "0.375rem" : "0.5rem",
        textAlign: "left",
        cursor: draggable ? "grab" : "default",
        // no longer using color as background
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onMouseEnter={() => (compact || tiny) && setMenuOpen(true)}
      onMouseLeave={() => (compact || tiny) && setMenuOpen(false)}
    >
      <Card.Body style={{ ...bodyStyle, position: "relative", display: "flex", flexDirection: "column" }}>
        {/* Top section: title, description, dueDate */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* Left side: color flag + title */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                minWidth: 0,
                gap: 6,
              }}
            >
              {color && (
                <span
                  aria-hidden="true"
                  style={{
                    width: tiny ? 8 : 10,
                    height: tiny ? 8 : 10,
                    borderRadius: 999,
                    backgroundColor: color,
                    flexShrink: 0,
                    boxShadow: "0 0 2px rgba(0,0,0,0.25)",
                  }}
                />
              )}
              <span style={titleStyle}>{title}</span>
            </div>
          </div>

          {showDescription && description && !compact && !tiny && (
            <div
              style={{
                marginTop: "0.25rem",
                fontSize: "0.9rem",
                color: "#555",
              }}
            >
              {description}
            </div>
          )}

          {dueDate && !tiny && (
            <div
              style={{
                marginTop: "0.12rem",
                fontSize: "0.8rem",
                color: "#888",
              }}
            >
              Due: {dueDate}
            </div>
          )}
        </div>

        {/* Bottom section: action buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 6,
            marginTop: "0.5rem",
          }}
        >
          {useMenu ? (
            <div style={{ position: "relative" }}>
              <button
                aria-label="open menu"
                style={menuBtnStyle}
                onClick={() => setMenuOpen((s) => !s)}
              >
                ⋯
              </button>
              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    marginTop: 6,
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 120,
                    }}
                  >
                    {onComplete && (
                      <button
                        onClick={() => {
                          onComplete();
                          setMenuOpen(false);
                        }}
                        style={{
                          padding: tiny ? "2px 6px" : "8px 12px",
                          border: "none",
                          background: "transparent",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: tiny ? "0.75rem" : undefined,
                        }}
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
                        style={{
                          padding: tiny ? "2px 6px" : "8px 12px",
                          border: "none",
                          background: "transparent",
                          textAlign: "left",
                          cursor: isInStudySession ? "not-allowed" : "pointer",
                          fontSize: tiny ? "0.75rem" : undefined,
                          opacity: isInStudySession ? 0.5 : 1,
                        }}
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
                        style={{
                          padding: tiny ? "2px 6px" : "8px 12px",
                          border: "none",
                          background: "transparent",
                          textAlign: "left",
                          color: "#b40",
                          cursor: "pointer",
                          fontSize: tiny ? "0.75rem" : undefined,
                        }}
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
            <div style={{ display: "flex", gap: 8 }}>
              {onComplete && (
                <Button
                  variant="success"
                  size={tiny ? "sm" : "sm"}
                  onClick={onComplete}
                  style={{ padding: tiny ? "2px 6px" : "4px 8px" }}
                  title="Mark as complete"
                >
                  <img src={checkCircleIcon} alt="complete" style={{ width: 16, height: 16 }} />
                </Button>
              )}
              {onAddToStudy && (
                <Button
                  variant={isInStudySession ? "secondary" : "info"}
                  size={tiny ? "sm" : "sm"}
                  onClick={onAddToStudy}
                  disabled={isInStudySession}
                  style={{ 
                    padding: tiny ? "2px 6px" : "4px 8px",
                    opacity: isInStudySession ? 0.6 : 1,
                    cursor: isInStudySession ? "not-allowed" : "pointer",
                  }}
                  title={isInStudySession ? "Already in study session" : "Add to Study Session"}
                >
                  <img src={plusCircleIcon} alt="add to study" style={{ width: 16, height: 16 }} />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="danger"
                  size={tiny ? "sm" : "sm"}
                  onClick={onDelete}
                  style={{ padding: tiny ? "2px 6px" : "4px 8px" }}
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
