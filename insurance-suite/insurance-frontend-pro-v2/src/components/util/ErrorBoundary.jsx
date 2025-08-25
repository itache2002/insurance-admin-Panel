import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      const msg = this.state.error?.message || String(this.state.error)
      return (
        <div className="p-4 rounded-xl border border-rose-600/40 bg-rose-950/20 text-rose-200">
          <div className="font-semibold mb-1">Something went wrong.</div>
          <div className="text-xs opacity-80">{msg}</div>
        </div>
      )
    }
    return this.props.children
  }
}
