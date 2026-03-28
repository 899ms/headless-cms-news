import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router';
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
              name: 'articles',
              list: '/articles',
              create: '/articles/create',
              edit: '/articles/edit/:id',
              show: '/articles/show/:id',
            },
          ]}
        >
          <Routes>
            <Route
              element={
                <div style={{ padding: '2rem' }}>
                  <Outlet />
                </div>
              }
            >
              <Route index element={<div><h1>欢迎使用管理后台</h1><p>使用 Refine 构建的新闻网站管理系统</p></div>} />
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
