import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import SingleProject from "../../components/SingleProject";
import {
  createProjectInputSchema,
  ICreateProjectInput,
} from "../../schemas/project";
import { api } from "../../utils/api";

const HomePage = () => {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm<{ title: string }>({
    resolver: zodResolver(createProjectInputSchema),
  });
  const { mutate: createProject } = api.project.createProject.useMutation({
    onSuccess: async ({ data }) => {
      await router.push(`/project/${data.id}`);
    },
  });

  const { data: dataProjects, isSuccess } =
    api.project.getAllProject.useQuery();

  const { mutate: logout } = api.user.logout.useMutation({
    onSuccess: async () => {
      await router.push("/login");
    },
  });

  const onSubmit = (data: ICreateProjectInput) => {
    createProject(data);
  };
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ title: "" });
    }
  }, [formState, reset]);

  const handleRedirect = (id: string) => {
    router.push(`/project/${id}`);
  };
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex-col">
        <div className="flex flex-col gap-2">
          {dataProjects?.data.map((project) => (
            <SingleProject
              key={project.id}
              title={project.title}
              handleClick={() => handleRedirect(project.id)}
            />
          ))}
        </div>
        <form className="flex flex-col pt-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            className="p-2 border-2"
            placeholder="Enter title"
            {...register("title")}
          />
          <button
            type="submit"
            className="bg-green-200 p-[10px] hover:border hover:border-solid hover:border-black hover:p-[9px]"
          >
            Create project
          </button>
        </form>
        <button
          onClick={() => logout()}
          className="mt-2 w-full bg-red-500 p-[10px] hover:border hover:border-solid hover:border-black hover:p-[9px]"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
