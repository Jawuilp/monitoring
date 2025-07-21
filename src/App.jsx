import { useState } from 'react';
import Home from './Home';
import View from './View';

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <div>
      <nav style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
        <button onClick={() => setPage('home')}>Analytics</button>
        <button onClick={() => setPage('view')}>Visualización</button>
      </nav>
      {page === 'home' ? <Home /> : <View />}
    </div>
  );
} 