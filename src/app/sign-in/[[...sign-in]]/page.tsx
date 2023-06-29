import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
// import { useEffect } from "react";

export default function Page() {
    // Force body background color on component mount and clean on unmount
    // useEffect(() => {
    //     document.body.classList.add('bg-gray-900');
    //     return () => {
    //         document.body.classList.remove('bg-gray-900');
    //     }
    // }, []);

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-900 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
                <SignIn routing="path" path="/sign-in" />
            </div>
        </div>
    );
}
