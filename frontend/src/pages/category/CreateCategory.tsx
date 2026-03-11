import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  type CategorySchema,
} from "../../schemas/category/categorySchema";
import { toast } from "react-toastify";
import { createCategory } from "../../services/categoryService";

export default function CreateCategory() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
  });

  async function onSubmit(data: CategorySchema) {
    try {
      const response = await createCategory(data);
      if (response.status === 201) {
        toast.success("Categoria criada");
        reset();
      } else {
        toast.error("Erro ao criar categoria");
      }
    } catch {
      toast.error("Erro ao criar categoria");
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 p-6 border rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold mb-4">Nova categoria</h2>

        <input
          {...register("name")}
          placeholder="Nome da categoria"
          className="w-full p-2 border rounded"
        />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}

        <div className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            {...register("is_active")}
            className="w-4 h-4"
          />

          <span className="text-sm text-gray-700">Categoria ativa</span>
        </div>

        {errors.is_active && (
          <p className="text-red-500 text-sm mt-1">
            {errors.is_active.message}
          </p>
        )}

        <button className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600 transition">
          Criar categoria
        </button>
      </form>
    </div>
  );
}
