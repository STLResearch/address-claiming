import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5">
      <p>404!</p>
      <p>oops! the page you try to visit does not exist</p>
      <button onClick={() => router.push("/dashboard")} className="rounded-md bg-bleach-brown p-2 text-white">
        return to homepage
      </button>
    </div>
  );
};

export default ErrorPage;
