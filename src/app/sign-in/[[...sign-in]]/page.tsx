import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800 px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-2xl text-white font-semibold mb-4">
                    Sign In to <span className="text-green-600 font-bold">TDX</span>
                </h1>
                <SignIn routing="path" path="/sign-in" />
            </div>
        </div>
    );
}
