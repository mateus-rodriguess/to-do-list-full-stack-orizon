import { useCallback, useEffect, useState } from "react";
import { getTasks } from "../../services/taskService";
import type { Task, TaskResponse } from "../../types/task";
import { Link } from "react-router-dom";
import {
  getAllCategories,
  type Category,
} from "../../services/categoryService";

const priorityConfig = {
  LOW: {
    label: "Baixa",
    className: "bg-green-100 text-green-700",
  },
  MEDIUM: {
    label: "Média",
    className: "bg-yellow-100 text-yellow-700",
  },
  HIGH: {
    label: "Alta",
    className: "bg-red-100 text-red-700",
  },
};

export default function Tasks() {
  const [data, setData] = useState<TaskResponse | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [isCompleted, setIsCompleted] = useState<string | "">("");
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchTasks = useCallback(async () => {
    const params: Record<string, unknown> = { page };
    if (search) params.search = search;
    if (category) params.category = category;
    if (isCompleted) params.is_completed = isCompleted;

    const data = await getTasks(params);
    setData(data);
  }, [page, search, category, isCompleted]);

  useEffect(() => {
    (async () => {
      await fetchTasks();
    })();
  }, [fetchTasks]);

  useEffect(() => {
    (async () => {
      const cats = await getAllCategories();
      setCategories(cats);
    })();
  }, []);

  if (!data) {
    return <div className="p-10 text-center text-gray-500">Carregando...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tarefas</h1>

        <div className="flex gap-2">
          <Link
            to="/tasks/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            + Nova tarefa
          </Link>

          <Link
            to="/categories/new"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            + Nova categoria
          </Link>
          <Link
            to="/categories"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Listar categorias
          </Link>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value ? Number(e.target.value) : "")
          }
          className="border p-2 rounded"
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={isCompleted}
          onChange={(e) => setIsCompleted(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos</option>
          <option value="true">Concluídas</option>
          <option value="false">Pendentes</option>
        </select>
      </div>

      <div className="grid gap-4">
        {data.result.map((task: Task) => {
          const priority = priorityConfig[task.priority];
          return (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="block bg-white rounded-lg shadow p-5 border hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    task.is_completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.is_completed ? "Concluída" : "Pendente"}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${priority.className}`}
                >
                  Prioridade: {priority.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={!data.previous}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="font-medium text-gray-700">Página {page}</span>

        <button
          disabled={!data.next}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
