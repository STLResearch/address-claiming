import { useRouter } from "next/router";

const ErrorPage = () => {
    const router = useRouter();

    return <div className="flex flex-col justify-center items-center gap-5 h-screen">
        <p>404!</p>
        <p>oops! the page you try to visit does not exist</p>
        <button onClick={() => router.push("/homepage/dashboard")} className="bg-bleach-brown rounded-md p-2 text-white">return to homepage</button>
    </div>
}

export default ErrorPage;
