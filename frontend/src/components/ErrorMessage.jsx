import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card text-center py-12 animate-fade-in">
      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red" />
      <p className="text-polar font-medium mb-2">Something went wrong</p>
      <p className="text-sm text-ash mb-6">{message || 'Could not load data. The server may be unavailable.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost flex items-center gap-2 mx-auto">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      )}
    </div>
  )
}
