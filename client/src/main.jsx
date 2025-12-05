import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom";
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { CampaignProvider } from './context/CampaignContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CampaignProvider>
        <ToastContainer />
        <RouterProvider router={router} />
      </CampaignProvider>
    </AuthProvider>
  </StrictMode>,
)
