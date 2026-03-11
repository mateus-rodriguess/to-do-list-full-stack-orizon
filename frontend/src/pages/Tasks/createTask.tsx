import { toast } from "react-toastify";
import TaskForm from "../../components/TaskForm";

export default function CreateTaskPage() {
  return <TaskForm onSaved={() => toast.success("Tarefa criada!")} />;
}
