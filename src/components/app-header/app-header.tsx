import { Component, FC, ReactNode } from 'react';
import { AppHeaderUI } from '@ui';
import { Outlet } from 'react-router-dom';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

export const AppHeader: FC = () => (
  <>
    <AppHeaderUI userName='' />
    <ErrorBoundary>
      <div style={{ minHeight: '100vh' }}>
        <Outlet />
      </div>
    </ErrorBoundary>
  </>
);
