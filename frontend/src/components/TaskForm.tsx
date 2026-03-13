import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskSchema } from "../schemas/task/taskSchema";
import { getAllUsersPage, type User } from "../services/userService";
import { getAllCategories, type Category } from "../services/categoryService";
import { createTask, updateTask, deleteTask } from "../services/taskService";
import { toast } from "react-toastify";

interface TaskFormProps {
  taskId?: number;
  defaultValues?: TaskSchema;
  onSaved?: () => void;
}

export default function TaskForm({
  taskId,
  defaultValues,
  onSaved,
}: TaskFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema) as never,
    defaultValues,
  });

  useEffect(() => {
    (async () => {
      const users = await getAllUsersPage();
      const categories = await getAllCategories();
      setUsers(users);
      setCategories(categories);
    })();
  }, []);

  const onSubmit: SubmitHandler<TaskSchema> = async (data) => {
    const payload = {
      ...data,
      collaborators: data.collaborators ?? [],
      due_date: data.due_date
        ? new Date(data.due_date).toISOString()
        : undefined,
    };

    try {
      if (taskId) {
        await updateTask(taskId, payload);
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        await createTask(payload);
        reset();
      }
      onSaved?.();
    } catch {
      toast.error("Erro ao salvar a tarefa");
    }
  };

  const handleDelete = async () => {
    if (!taskId) return;
    if (!confirm("Deseja realmente deletar esta tarefa?")) return;

    try {
      await deleteTask(taskId);
      toast.success("Tarefa deletada com sucesso!");
      onSaved?.();
    } catch {
      toast.error("Erro ao deletar a tarefa");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[500px] p-6 border rounded-lg shadow space-y-4"
      >
        <h2 className="text-2xl font-bold">
          {taskId ? "Editar Task" : "Nova Task"}
        </h2>

        <input
          {...register("title")}
          placeholder="Título"
          className="w-full p-2 border rounded"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        <textarea
          {...register("description")}
          placeholder="Descrição"
          className="w-full p-2 border rounded"
        />

        <select {...register("category")} className="w-full p-2 border rounded">
          <option value="">Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}

        <select {...register("priority")} className="w-full p-2 border rounded">
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
        </select>

        <input
          type="date"
          {...register("due_date")}
          className="w-full p-2 border rounded"
        />

        <div>
          <p className="font-medium mb-2">Colaboradores</p>
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            {users.map((user) => (
              <label key={user.id} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  value={user.id}
                  {...register("collaborators")}
                />
                {user.username || user.email}
              </label>
            ))}
          </div>
        </div>
        {errors.collaborators && (
          <p className="text-red-500 text-sm">Colaboradores inválidos</p>
        )}

        <label className="flex gap-2">
          <input type="checkbox" {...register("is_completed")} /> Concluída
        </label>

        <label className="flex gap-2">
          <input type="checkbox" {...register("is_active")} /> Ativa
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {taskId ? "Atualizar" : "Criar"}
          </button>

          {taskId && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Deletar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
