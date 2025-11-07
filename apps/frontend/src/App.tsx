import { useEffect, useState } from 'react';

type Health = { status: 'ok' } | { status: 'down' };

export default function App() {
  const [health, setHealth] = useState<Health>({ status: 'down' });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/health`)
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ status: 'down' }));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>MediCare – frontend</h1>
      <p>
        API base: <code>{import.meta.env.VITE_API_BASE}</code>
      </p>
      <p>
        Health: <b>{health.status}</b>
      </p>
      <p>
        Swagger:{' '}
        <a href={`${import.meta.env.VITE_API_BASE}/api-docs`} target="_blank" rel="noreferrer">
          /api-docs
        </a>
      </p>
    </main>
  );
}
