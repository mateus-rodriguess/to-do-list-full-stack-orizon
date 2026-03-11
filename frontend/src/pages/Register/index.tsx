import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchema,
} from "../../schemas/user/registerSchema";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/authService";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterSchema) {
    try {
      const response = await createUser(data);
      if (response.status === 201) {
        navigate("/login");
      } else {
        toast.error("Usuário ou senha inválidos");
      }
    } catch {
      toast.error("Usuário ou senha inválidos");
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 p-6 border rounded-lg shadow"
      >
        <h2 className="text-2xl mb-4">Criar conta</h2>

        <input
          {...register("first_name")}
          placeholder="Nome"
          className="w-full mb-2 p-2 border rounded"
        />
        {errors.first_name && (
          <p className="text-red-500 text-sm">{errors.first_name.message}</p>
        )}

        <input
          {...register("last_name")}
          placeholder="Sobrenome"
          className="w-full mb-2 p-2 border rounded"
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm">{errors.last_name.message}</p>
        )}

        <input
          {...register("email")}
          placeholder="Email"
          className="w-full mt-3 mb-2 p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          {...register("username")}
          placeholder="username"
          className="w-full mt-3 mb-2 p-2 border rounded"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}

        <input
          type="password"
          {...register("password")}
          placeholder="Senha"
          className="w-full mt-3 mb-2 p-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirmar senha"
          className="w-full mt-3 mb-2 p-2 border rounded"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        <button className="w-full bg-blue-500 text-white p-2 mt-4 rounded">
          Registrar
        </button>
      </form>
    </div>
  );
}
