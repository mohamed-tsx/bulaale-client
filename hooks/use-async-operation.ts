import { useCallback } from 'react'
import { useErrorHandler } from '@/lib/contexts/error-handler-context'

export function useAsyncOperation() {
  const { handleError, handleSuccess } = useErrorHandler()

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: {
      successMessage?: string
      errorMessage?: string
      onSuccess?: (result: T) => void
      onError?: (error: unknown) => void
    }
  ): Promise<T | null> => {
    try {
      const result = await operation()
      
      if (options?.successMessage) {
        handleSuccess(options.successMessage)
      }
      
      if (options?.onSuccess) {
        options.onSuccess(result)
      }
      
      return result
    } catch (error) {
      if (options?.errorMessage) {
        handleError(error, options.errorMessage)
      } else {
        handleError(error)
      }
      
      if (options?.onError) {
        options.onError(error)
      }
      
      return null
    }
  }, [handleError, handleSuccess])

  return { execute }
}
