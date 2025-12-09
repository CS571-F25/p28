import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "ontrack_users";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function tasksKey(username) {
  return `ontrack_tasks_${username}`;
}

function columnsKey(username) {
  return `ontrack_columns_${username}`;
}

function completedKey(username) {
  return `ontrack_completed_${username}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => null);

  const register = (username, password) => {
    if (!username || !password) return { success: false, message: "Missing fields" };
    const users = loadUsers();
    if (users.find((u) => u.username === username)) {
      return { success: false, message: "User already exists" };
    }
    users.push({ username, password });
    saveUsers(users);
    setUser({ username });
    return { success: true };
  };

  const login = (username, password) => {
    const users = loadUsers();
    const found = users.find((u) => u.username === username && u.password === password);
    if (!found) return { success: false, message: "Invalid username or password" };
    setUser({ username });
    return { success: true };
  };

  const logout = () => setUser(null);

  const getTasks = () => {
    if (!user) return [];
    try {
      return JSON.parse(localStorage.getItem(tasksKey(user.username)) || "[]");
    } catch (e) {
      return [];
    }
  };

  const saveTasks = (tasks) => {
    if (!user) return;
    localStorage.setItem(tasksKey(user.username), JSON.stringify(tasks));
  };

  const getColumns = () => {
    if (!user) return [];
    try {
      return JSON.parse(localStorage.getItem(columnsKey(user.username)) || "null") || [];
    } catch (e) {
      return [];
    }
  };

  const setColumns = (cols) => {
    if (!user) return [];
    localStorage.setItem(columnsKey(user.username), JSON.stringify(cols));
    return cols;
  };

  const getCompleted = () => {
    if (!user) return 0;
    try {
      const v = localStorage.getItem(completedKey(user.username));
      return v ? Number(v) : 0;
    } catch (e) {
      return 0;
    }
  };

  const setCompleted = (n) => {
    if (!user) return 0;
    localStorage.setItem(completedKey(user.username), String(n));
    return n;
  };

  const incrementCompleted = () => {
    if (!user) return 0;
    const cur = getCompleted();
    const next = cur + 1;
    setCompleted(next);
    return next;
  };

  const addTask = (task) => {
    if (!user) return [];
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    return tasks;
  };

  const deleteTask = (index) => {
    if (!user) return [];
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    return tasks;
  };

  const setTasks = (tasks) => {
    if (!user) return [];
    saveTasks(tasks);
    return tasks;
  };

  const updateTaskById = (id, updates) => {
    if (!user) return [];
    const tasks = getTasks();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return tasks;
    tasks[idx] = { ...tasks[idx], ...updates };
    saveTasks(tasks);
    return tasks;
  };

  const completeTaskById = (id) => {
    if (!user) return [];
    const tasks = getTasks();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return tasks;
    // remove the task
    tasks.splice(idx, 1);
    saveTasks(tasks);
    // increment completed count
    incrementCompleted();
    return tasks;
  };

  return (
    <AuthContext.Provider value={{
      user,
      register,
      login,
      logout,
      getTasks,
      addTask,
      deleteTask,
      setTasks,
      updateTaskById,
      getColumns,
      setColumns,
      getCompleted,
      setCompleted,
      incrementCompleted,
      completeTaskById,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
