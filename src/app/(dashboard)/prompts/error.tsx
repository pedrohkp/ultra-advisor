'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <h2>Algo deu errado! 😢</h2>
            <pre style={{ backgroundColor: '#333', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
                {error.message}
            </pre>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                }}
            >
                Tentar novamente
            </button>
        </div>
    )
}
