import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'

export default function Home() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/hello/')
            .then(res => res.json())
            .then(data => {
                setMessage(data.message);
                setLoading(false);
            })
    }, [])

    return (
        <div className={styles.container}>
            <p> {!loading ? message : "Loading.."}</p>
        </div>
    )
}