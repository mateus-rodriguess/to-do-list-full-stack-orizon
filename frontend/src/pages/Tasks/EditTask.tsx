import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskForm from "../../components/TaskForm";
import { getTaskById } from "../../services/taskService";
import type { TaskSchema } from "../../schemas/task/taskSchema";
import { toast } from "react-toastify";

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskSchema | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const response = await getTaskById(Number(id));
        setTask(response.result);
      } catch {
        toast.error("Erro ao carregar a tarefa");
        navigate("/");
      }
    })();
  }, [id, navigate]);

  if (!task) return <p className="p-10 text-center">Carregando tarefa...</p>;

  return (
    <TaskForm
      taskId={Number(id)}
      defaultValues={task}
      onSaved={() => navigate("/")}
    />
  );
}
