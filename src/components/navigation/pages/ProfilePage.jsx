import { useState, useEffect } from "react";
import { Form, Button, Card, Image } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [interests, setInterests] = useState("");
  const auth = useAuth();
  const [completed, setCompleted] = useState(() => (auth ? auth.getCompleted() : 0));

  useEffect(() => {
    setCompleted(auth ? auth.getCompleted() : 0);
  }, [auth?.user]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      {/* Profile Form */}
      <Card style={{ width: "400px", padding: "2rem" }}>
        <Card.Body>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Interests</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" disabled style={{ width: "100%" }}>
              Save
            </Button>
          </Form>

          {/* Display user info */}
          <div style={{ marginTop: "2rem" }}>
            <h5>Profile Info:</h5>
            <p><strong>Name:</strong> {name || "—"}</p>
            <p><strong>Year:</strong> {year || "—"}</p>
            <p><strong>Interests:</strong> {interests || "—"}</p>
            <p><strong>Tasks Completed:</strong> {completed ?? 0}</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
