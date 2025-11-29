import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Oops! Algo deu errado</h2>
            <p className="text-gray-400 mb-6">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-indigo-600 rounded-xl px-6 py-3 font-semibold transition flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary