import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ISignup, signupSchema } from "../../schemas/auth";
import { api } from "../../utils/api";

const RegisterPage = () => {
    const router=useRouter()
  const { mutateAsync } = api.user.registerUser.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignup>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: ISignup) => {
      await mutateAsync(data);
    await router.push('/')
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
      <div className="flex flex-col w-1/3 bg-white border h-72 rounded-md border-gray-50">
        <p className="text-center text-black"> Colab Editor</p>
        <div className="flex flex-col items-center justify-around min-h-full gap-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="w-full pb-2 text-center outline-none"
              placeholder="Email"
              {...register("email")}
            />
            <input
              className="w-full pb-2 text-center outline-none"
              placeholder="Username"
              {...register("username")}
            />
            <input
              className="w-full text-center outline-none"
              placeholder="Password"
              {...register("password")}
            />
            <button
              type="submit"
              className="w-full mt-5 text-center border-2 hover:bg-blue-100"
            >
              REGISTER
            </button>
          </form>

          <Link
            className="flex justify-center text-xs font-bold text-red-500"
            href="/"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
