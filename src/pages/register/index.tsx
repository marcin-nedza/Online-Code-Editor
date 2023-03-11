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
    await router.push('/login')
  };

  return (
      <div className="flex items-center justify-center w-screen h-screen bg-main-bg">
        <div className="flex  h-[25rem] w-[20rem] flex-col border border-accent bg-accent2">
          <div className="">
            <p className="py-2 text-2xl text-center text-white">SynCode</p>
            <p className="px-4 pt-2 text-sm text-center text-white">
              Perfect tool for online coding with friends{" "}
            </p>
          </div>

          <form
            className="flex flex-col items-center mt-auto mb-16 text-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="w-3/4 py-2 text-center text-white border border-b-0 outline-none border-accent bg-main-bg"
              placeholder="Email"
              {...register("email")}
            />
  <input
              className="w-3/4 py-2 text-center text-white border border-b-0 outline-none border-accent bg-main-bg"
              placeholder="Username"
              {...register("username")}
            />
            <input
              className="w-3/4 py-2 text-center text-white border outline-none border-accent bg-main-bg"
              placeholder="Password"
              {...register("password")}
            />
            <button className="w-3/4 py-2 mt-2 text-sm text-white border border-accent bg-secondary hover:bg-accent active:bg-blue-accent">
                        Sign Up
            </button>
          </form>
          <div className="mb-2 text-center">
            <Link
              href="/login"
              className="text-xs text-blue-accent hover:text-blue-accent-light"
            >
                You have an account?Log In
            </Link>
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;
