//main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import './styles/variables.css'; // Theme variables first
import './styles/index.css'; // Global styles
import './styles/animations.css'; // Animations

import { register } from 'swiper/element/bundle';

register();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <AppProvider> */}
      <App />
    {/* </AppProvider> */}
  </StrictMode>
);
