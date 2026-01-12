import React from 'react';

/**
 * Generic Error Boundary for React components.
 * Usage:
 *   <ErrorBoundary fallback={<MyFallback />}>
 *     <MyComponent />
 *   </ErrorBoundary>
 */
// @ts-ignore
export class ErrorBoundary extends React.Component<React.ComponentPropsWithChildren, { hasError: boolean }> {
  state: { hasError: boolean } = { hasError: false };

  static getDerivedStateFromError(_error: Error) {
    // Return an object to update state so that UI shows the fallback
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can log the error to an error reporting service if desired
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback;
    }

    // Otherwise render children normally
    return this.props.children;
  }
}