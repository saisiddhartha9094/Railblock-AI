import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-center font-mono">
          <div className="max-w-2xl w-full bg-red-950/40 border border-red-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-red-400">⚠️ React Component Error Encountered</h2>
            <p className="text-xs text-slate-300">
              An error occurred during rendering. Details below:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-red-300 font-mono overflow-auto max-h-48">
              {this.state.error?.toString()}
            </div>
            {this.state.errorInfo && (
              <pre className="text-[10px] text-slate-400 font-mono overflow-auto max-h-48 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
