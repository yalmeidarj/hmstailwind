"use client"
import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';
import UserInfo from './UserInfo';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <Link href="/">
                    <span className="font-semibold text-xl tracking-tight cursor-pointer">TDX Solutions</span>
                </Link>
            </div>
            <UserInfo />
            <div className="lg:hidden">
                <button onClick={toggleMenu} className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                    <FaBars className="h-6 w-6" />
                </button>
            </div>
            <div className="lg:flex" style={{ display: (isOpen && isClient) ? 'block' : 'none' }}>
                <div className="text-sm lg:flex-grow">
                    <Link href="/">
                        <span className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer">
                            Locations
                        </span>
                    </Link>
                    <Link href="/dashboard">
                        <span className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer">
                            Dashboard
                        </span>
                    </Link>
                    <Link href="/infolocation">
                        <span className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer">
                            Site Info
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;


