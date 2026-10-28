import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Admin Error Boundary caught error]:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d0d0d] text-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-full border border-red-500/40 bg-red-950/20 flex items-center justify-center text-xl text-red-400 mb-4">
            ⚠
          </div>
          <h2 className="text-2xl font-serif text-[#C6A75E] mb-2">Something went wrong</h2>
          <p className="text-gray-400 max-w-md mb-6 text-sm">
            An unexpected error occurred while rendering the administration dashboard.
          </p>
          <button
            onClick={this.handleReload}
            className="px-5 py-2 rounded-full bg-[#C6A75E] text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition"
          >
            Reload Dashboard
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
