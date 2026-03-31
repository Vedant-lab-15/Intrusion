import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true, errorId: Date.now().toString(36) };
  }

  componentDidCatch(error, info) {
    // In production this would send to a logging service, not console
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 text-sm mb-4">
            An unexpected error occurred. Reference: <code className="text-gray-300">{this.state.errorId}</code>
          </p>
          <button
            onClick={() => this.setState({ hasError: false, errorId: null })}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
