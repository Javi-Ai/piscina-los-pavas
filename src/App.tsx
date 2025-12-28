import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './router/index';
import './styles/App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;
