import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  type CategorySchema,
} from "../../schemas/category/categorySchema";
import { updateCategory } from "../../services/categoryService";
import { toast } from "react-toastify";

export default function CategoryUpdate() {
  const { id } = useParams();

  const { register, handleSubmit } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
  });

  async function onSubmit(data: CategorySchema) {
    try {
      await updateCategory(Number(id), data);
      toast.success("Categoria atualizada");
    } catch {
      toast.error("Erro ao atualizar categoria");
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 p-6 border rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold mb-4">Editar categoria</h2>

        <input
          {...register("name")}
          placeholder="Nome da categoria"
          className="w-full p-2 border rounded"
        />

        <div className="flex items-center gap-2 mt-3">
          <input type="checkbox" {...register("is_active")} />
          <span>Categoria ativa</span>
        </div>

        <button className="w-full bg-green-500 text-white p-2 rounded mt-4">
          Atualizar
        </button>
      </form>
    </div>
  );
}
