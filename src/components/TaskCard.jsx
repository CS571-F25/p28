import { useState } from "react";
import { Card, Button } from "react-bootstrap";

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
        background: color || undefined,
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onMouseEnter={() => (compact || tiny) && setMenuOpen(true)}
      onMouseLeave={() => (compact || tiny) && setMenuOpen(false)}
    >
      <Card.Body style={{ ...bodyStyle, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={titleStyle}>{title}</span>

          {useMenu ? (
            <div style={{ position: "relative" }}>
              <button aria-label="open menu" style={menuBtnStyle} onClick={() => setMenuOpen((s) => !s)}>
                ⋯
              </button>
              {menuOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 6, background: "#fff", border: "1px solid #ddd", borderRadius: 6, boxShadow: "0 6px 18px rgba(0,0,0,0.08)", zIndex: 1000 }}>
                  <div style={{ display: "flex", flexDirection: "column", minWidth: 120 }}>
                    {onComplete && (
                      <button onClick={() => { onComplete(); setMenuOpen(false); }} style={{ padding: tiny ? "2px 6px" : "8px 12px", border: "none", background: "transparent", textAlign: "left", cursor: "pointer", fontSize: tiny ? "0.75rem" : undefined }}>
                        Complete
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => { onDelete(); setMenuOpen(false); }} style={{ padding: tiny ? "2px 6px" : "8px 12px", border: "none", background: "transparent", textAlign: "left", color: "#b40", cursor: "pointer", fontSize: tiny ? "0.75rem" : undefined }}>
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
                <Button variant="success" size={tiny ? "sm" : "sm"} onClick={onComplete} style={{ padding: tiny ? "2px 6px" : undefined }}>
                  ✓
                </Button>
              )}
              {onDelete && (
                <Button variant="danger" size={tiny ? "sm" : "sm"} onClick={onDelete} style={{ padding: tiny ? "2px 6px" : undefined }}>
                  X
                </Button>
              )}
            </div>
          )}
        </div>

        {showDescription && description && !compact && !tiny && <div style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "#555" }}>{description}</div>}

        {dueDate && !tiny && (
          <div style={{ marginTop: "0.12rem", fontSize: "0.8rem", color: "#888" }}>
            Due: {dueDate}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
