import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Navbar 
      fixed="top" 
      variant="dark"
      className="px-3"
      style={{
        height: "70px",
        backgroundColor: "var(--color-background-alt)",
      }}
    >
      <Container 
        fluid 
        className="d-flex justify-content-between align-items-center"
      >
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontFamily: "var(--font-logo)",
            fontSize: "1.8rem",
          }}
        >
          <span style={{ color: "white" }}>On</span>
          <span style={{ color: "var(--color-primary)" }}>Track</span>
        </Navbar.Brand>

        {/* Nav Links */}
        <Nav className="gap-5">
          <Nav.Link as={Link} to="/study-session">
            Study Session
          </Nav.Link>
          <Nav.Link as={Link} to="/calendar">
            Weekly Calendar
          </Nav.Link>
        </Nav>

        <Nav.Link as={Link} to="/profile">
            Profile
          </Nav.Link>
      </Container>
    </Navbar>
  );
}
