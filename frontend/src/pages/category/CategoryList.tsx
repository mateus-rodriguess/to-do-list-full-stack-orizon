import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCategories, type Category } from "../../services/categoryService";

type CategoryResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  result: Category[];
};

export default function CategoryList() {
  const [data, setData] = useState<CategoryResponse | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getCategories({
        page,
        page_size: 10,
        search,
      });

      setData(response);
    } catch (err) {
      console.error("Erro ao carregar categorias", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Categorias</h1>

      <div className="flex gap-3 mb-6">
        <input
          placeholder="Buscar categoria"
          className="border p-2 rounded"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <button
          onClick={() => {
            setPage(1);
            setSearch(searchInput);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {loading && <p>Carregando...</p>}

      <div className="grid gap-4">
        {data?.result.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className="block bg-white rounded-lg shadow p-5 border hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{category.name}</h2>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  category.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {category.is_active ? "Ativa" : "Inativa"}
              </span>
            </div>
          </Link>
        ))}

        {data && !data?.result?.length && (
          <p className="text-gray-500">Nenhuma categoria encontrada</p>
        )}
      </div>

      {data && (
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
      )}
    </div>
  );
}
