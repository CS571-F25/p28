import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const res = auth.login(username.trim(), password);
      if (!res.success) return setError(res.message);
      navigate("/");
    } else {
      if (!password) return setError("Password cannot be empty");
      if (password !== confirmPassword) return setError("Passwords do not match");

      const res = auth.register(username.trim(), password);
      if (!res.success) return setError(res.message);
      setConfirmPassword("");
      navigate("/");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Card style={{ width: 400, padding: "1.5rem" }}>
        <Card.Body>
          <h3 style={{ textAlign: "center" }}>{mode === "login" ? "Log In" : "Create Account"}</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>

            {mode === "register" && (
              <Form.Group className="mb-2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </Form.Group>
            )}

            {error && <div style={{ color: "red", marginBottom: "0.5rem" }}>{error}</div>}

            <Button type="submit" style={{ width: "100%" }}>{mode === "login" ? "Log In" : "Register"}</Button>
          </Form>

          <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
            {mode === "login" ? (
              <>
                <span>Don't have an account? </span>
                <Button variant="link" onClick={() => { setMode("register"); setError(""); setConfirmPassword(""); setPassword(""); }}>Create one</Button>
              </>
            ) : (
              <>
                <span>Already have an account? </span>
                <Button variant="link" onClick={() => { setMode("login"); setError(""); setConfirmPassword(""); setPassword(""); }}>Log in</Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
