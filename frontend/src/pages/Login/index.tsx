import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../../schemas/user/loginSchema";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await login(data.username, data.password);

      localStorage.setItem("token", response.token);
      navigate("/");
      window.location.reload();
    } catch {
      toast.error("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <div className="mb-4">
          <label>Username</label>
          <input
            {...register("username")}
            className="w-full border p-2 rounded"
            type="username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label>Senha</label>
          <input
            {...register("password")}
            className="w-full border p-2 rounded"
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Entrar
        </button>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Não tem conta?{" "}
          <a
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
          >
            Criar conta
          </a>
        </p>
      </form>
    </div>
  );
}
