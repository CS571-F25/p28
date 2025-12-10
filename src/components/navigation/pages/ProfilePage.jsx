import { useState, useEffect } from "react";
import { Form, Button, Card, Image } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [interests, setInterests] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const auth = useAuth();
  const [completed, setCompleted] = useState(() => (auth ? auth.getCompleted() : 0));

  useEffect(() => {
    setCompleted(auth ? auth.getCompleted() : 0);
  }, [auth?.user]);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      {/* Profile Card */}
      <Card style={{ width: "400px", padding: "2rem" }}>
        <Card.Body>
          {isEditing ? (
            // Editing Mode
            <>
              <h3 style={{ marginBottom: "1.5rem" }}>Edit Profile</h3>
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

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Button variant="primary" onClick={handleSave} style={{ flex: 1 }}>
                    Save
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)} style={{ flex: 1 }}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </>
          ) : (
            // Display Mode
            <>
              <h2 style={{ marginBottom: "1.5rem", color: "#000" }}>
                Hello {auth.user.username.charAt(0).toUpperCase() + auth.user.username.slice(1)}!
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                {name && (
                  <p style={{ marginBottom: "0.75rem" }}>
                    <strong>Name:</strong> {name}
                  </p>
                )}
                {year && (
                  <p style={{ marginBottom: "0.75rem" }}>
                    <strong>Year:</strong> {year}
                  </p>
                )}
                {interests && (
                  <p style={{ marginBottom: "0.75rem" }}>
                    <strong>Interests:</strong> {interests}
                  </p>
                )}
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong>Tasks Completed:</strong> {completed ?? 0}
                </p>
              </div>

              <Button variant="primary" onClick={handleEdit} style={{ width: "100%" }}>
                Edit Profile
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
