import Link from 'next/link';

const UserSection = () => {
    // const isUserLoggedIn = isLoggedIn(); // This function needs to be implemented based on your authentication setup

    return (
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
                <Link href="/">
                    <h1 className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                        Locations
                    </h1>
                </Link>
            </div>

            {/* {isUserLoggedIn ? (
                <div className="mt-4 lg:mt-0">
                    <button className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white">Sign out</button>
                </div>
            ) : (
                <div className="mt-4 lg:mt-0">
                    <Link href="/login">
                        <a className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white">Log in</a>
                    </Link>
                </div>
            )} */}
        </div>
    );
}

export default UserSection;
