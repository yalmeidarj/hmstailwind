'use client';

import { useRouter } from 'next/navigation';
import styles from './GoBack.module.css';

interface PageProps {
    text: string;
}

export default function Page({ text }: PageProps) {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={() => router.back()}
            >
                {text}
            </button>
        </div>
    );
}