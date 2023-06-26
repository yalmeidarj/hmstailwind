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

            <button className={styles.button} type="button" onClick={() => router.back()}>
                {text}
            </button>
        </div>
    );
}