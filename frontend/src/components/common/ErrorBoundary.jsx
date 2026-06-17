import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6 max-w-lg w-full">
            <h2 className="text-lg font-bold text-red-600 mb-2">Ocurrió un error</h2>
            <p className="text-sm text-gray-600 mb-4">
              Algo salió mal al mostrar esta página. Por favor toma una foto de este mensaje y compártelo.
            </p>
            <pre className="bg-gray-100 text-xs p-3 rounded-lg overflow-auto max-h-48 whitespace-pre-wrap">
              {this.state.error?.toString()}
              {this.state.errorInfo?.componentStack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;