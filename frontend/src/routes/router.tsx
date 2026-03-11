import { Routes, Route } from "react-router-dom";
import Tasks from "../pages/Tasks";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateCategory from "../pages/category/CreateCategory";
import CreateTask from "../pages/Tasks/createTask";
import EditTaskPage from "../pages/Tasks/EditTask";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Tasks />} />
      <Route path="/tasks/new" element={<CreateTask />} />
      <Route path="/tasks/:id" element={<EditTaskPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/categories/new" element={<CreateCategory />} />
    </Routes>
  );
}
