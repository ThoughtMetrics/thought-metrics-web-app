// App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

function App() {
  return (
    // <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    // </QueryClientProvider>
  );
}

export default App;
