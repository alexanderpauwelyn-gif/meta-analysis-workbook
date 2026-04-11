import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';

function AppContent() {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return <Login />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
