import { Card, Button } from "react-bootstrap";

export default function TaskCard({ title, description, dueDate, onDelete }) {
  return (
    <Card style={{ marginBottom: "0.5rem", textAlign: "left" }}>
      <Card.Body style={{ padding: "0.5rem 0.75rem", display: "flex", flexDirection: "column" }}>
        {/* Task title and delete button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: "bold" }}>{title}</span>
          {onDelete && (
            <Button variant="danger" size="sm" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>

        {/* Optional description */}
        {description && <div style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "#555" }}>{description}</div>}

        {/* Optional due date */}
        {dueDate && (
          <div style={{ marginTop: "0.25rem", fontSize: "0.8rem", color: "#888" }}>
            Due: {dueDate}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
