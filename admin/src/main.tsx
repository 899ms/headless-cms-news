import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router-v6';
import dataProvider from '@refinedev/simple-rest';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider('http://localhost:8787')}
          resources={[
            {
              name: 'posts',
              list: '/posts',
              create: '/posts/create',
              edit: '/posts/edit/:id',
              show: '/posts/show/:id',
            },
          ]}
        >
          <Routes>
            <Route
              element={
                <div>
                  <Outlet />
                </div>
              }
            >
              <Route index element={<div>欢迎使用管理后台</div>} />
            </Route>
          </Routes>
          <RefineKbar />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
