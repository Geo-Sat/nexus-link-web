import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BaseLayout } from "@/components/layout/BaseLayout";
import { PrivateRoute } from '@/components/PrivateRoute'; // Import the new PrivateRoute
import { appRoutes } from './routes';
import Joyride from 'react-joyride';


const queryClient = new QueryClient();

const App = () => {
  const [runTour, setRunTour] = useState(false);
  const [tourSteps, setTourSteps] = useState([
    {
      target: '.left-panel',
      content: 'This is the main control panel where you can search and filter vehicles and accounts.',
      placement: 'right',
    },
    {
      target: '.account-search-overlay',
      content: 'Search and select accounts here to filter vehicles.',
      placement: 'right',
    },
    {
      target: '.vehicle-search-overlay',
      content: 'Find specific vehicles by registration, driver, or model.',
      placement: 'right',
    },
    {
      target: '.selected-vehicles-table',
      content: 'View details of your selected vehicles here.',
      placement: 'bottom',
    },
    {
      target: '.google-map-container',
      content: 'The interactive map displays all your tracked vehicles in real-time.',
      placement: 'left',
    },
  ]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setRunTour(true);
    }, 500); // Small delay to allow DOM to render
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/*<Joyride*/}
          {/*  run={runTour}*/}
          {/*  steps={tourSteps}*/}
          {/*  continuous*/}
          {/*  showProgress*/}
          {/*  showSkipButton*/}
          {/*  styles={{*/}
          {/*    options: {*/}
          {/*      zIndex: 10000,*/}
          {/*    },*/}
          {/*  }}*/}
          {/*/>*/}
          <Routes>
            {appRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  route.redirectTo ? (
                    <Navigate to={route.redirectTo} replace />
                  ) : route.isPrivate ? (
                    <PrivateRoute roles={route.roles}>
                      <BaseLayout setRunTour={setRunTour}>{route.element}</BaseLayout>
                    </PrivateRoute>
                  ) : (
                    route.element
                  )
                }
              />
            ))}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;
