import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import MonthCalendar from "../../Calendar";
import { useAuth } from "../../../contexts/AuthContext";

export default function ProfilePage() {
  const auth = useAuth();
  
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [interests, setInterests] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [completed, setCompleted] = useState(() => (auth ? auth.getCompleted() : 0));

  useEffect(() => {
    if (auth.user) {
      setTasks(auth.getTasks() || []);
      setCompleted(auth.getCompleted() || 0);
    } else {
      setTasks([]);
      setCompleted(0);
    }
  }, [auth.user]);

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = (field) => {
    if (field === "name") setName(tempValue);
    if (field === "year") setYear(tempValue);
    if (field === "interests") setInterests(tempValue);
    setEditingField(null);
    setTempValue("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const monthLabel = (() => {
    const d = selectedDate;
    return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  })();

  return (
    <Container fluid style={{ padding: 0, minHeight: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid #e6e6e6",
            padding: 12,
            background: "var(--color-background-alt)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div>
            <h4 style={{ margin: 0, color: "var(--color-primary)" }}>Profile</h4>
          </div>
        </div>

        {/* Content: left (profile), right (calendar) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: 12,
            gap: 16,
            overflow: "hidden",
          }}
        >
          {/* Left: Profile Section */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              background: "var(--color-background)",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {/* Welcome Header */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ margin: 0, color: "var(--color-text)", fontSize: 28, fontWeight: 600 }}>
                Hello {auth.user.username.charAt(0).toUpperCase() + auth.user.username.slice(1)}!
              </h2>
              <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: 14 }}>
                Manage your profile information
              </p>
            </div>

            {/* Profile Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Name Field */}
              <ProfileField
                label="Name"
                value={name}
                placeholder="Add your name"
                isEditing={editingField === "name"}
                tempValue={tempValue}
                onEdit={() => handleEdit("name", name)}
                onSave={() => handleSave("name")}
                onCancel={handleCancel}
                onChange={setTempValue}
              />

              {/* Year Field */}
              <ProfileField
                label="Year"
                value={year}
                placeholder="Add your year"
                isEditing={editingField === "year"}
                tempValue={tempValue}
                onEdit={() => handleEdit("year", year)}
                onSave={() => handleSave("year")}
                onCancel={handleCancel}
                onChange={setTempValue}
              />

              {/* Interests Field */}
              <ProfileField
                label="Interests"
                value={interests}
                placeholder="Add your interests"
                isEditing={editingField === "interests"}
                tempValue={tempValue}
                onEdit={() => handleEdit("interests", interests)}
                onSave={() => handleSave("interests")}
                onCancel={handleCancel}
                onChange={setTempValue}
              />

              {/* Tasks Completed (Read-only) */}
              <div
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
                      Tasks Completed
                    </div>
                  </div>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "var(--color-primary)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    {completed ?? 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Activity Calendar */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              background: "var(--color-background)",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 24,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--color-text)" }}>
                Activity Calendar
              </h3>
              <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: 13 }}>
                {monthLabel}
              </p>
            </div>
            
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: 600 }}>
                <MonthCalendar
                  tasks={tasks}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              </div>
            </div>

            {/* Legend */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
                Task density
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>Less</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, border: "1px solid #e5e7eb", background: "transparent" }} />
                  <div style={{ width: 16, height: 16, borderRadius: 3, background: "var(--color-primary)", opacity: 0.25 }} />
                  <div style={{ width: 16, height: 16, borderRadius: 3, background: "var(--color-primary)", opacity: 0.6 }} />
                  <div style={{ width: 16, height: 16, borderRadius: 3, background: "var(--color-primary)", opacity: 1 }} />
                </div>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

// Reusable Profile Field Component
function ProfileField({
  label,
  value,
  placeholder,
  isEditing,
  tempValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
}) {
  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
            {label}
          </div>
          {isEditing ? (
            <div style={{ marginTop: 8 }}>
              <input
                type="text"
                value={tempValue}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoFocus
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14,
                  outline: "none",
                  background: "white",
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  onClick={onSave}
                  style={{
                    padding: "6px 12px",
                    fontSize: 12,
                    background: "var(--color-primary)",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Save
                </button>
                <button
                  onClick={onCancel}
                  style={{
                    padding: "6px 12px",
                    fontSize: 12,
                    background: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 15, color: "var(--color-text)" }}>
              {value || <span style={{ color: "#9ca3af", fontStyle: "italic" }}>{placeholder}</span>}
            </div>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={onEdit}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              marginLeft: 8,
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}