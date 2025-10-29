import { Component, FC, ReactNode } from 'react';
import { AppHeaderUI } from '@ui';
import { Outlet } from 'react-router-dom';

export const AppHeader: FC = () => (
  <>
    <AppHeaderUI userName='' />
    <div style={{ minHeight: '100vh' }}>
      <Outlet />
    </div>
  </>
);
