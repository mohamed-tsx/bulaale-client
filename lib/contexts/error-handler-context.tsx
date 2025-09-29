"use client"

import { createContext, useContext, useCallback, ReactNode } from 'react'
import { toast } from '@/hooks/use-toast'

interface ErrorHandlerContextType {
  handleError: (error: unknown, fallbackMessage?: string) => void
  handleSuccess: (message: string, title?: string) => void
  handleWarning: (message: string, title?: string) => void
  handleInfo: (message: string, title?: string) => void
}

const ErrorHandlerContext = createContext<ErrorHandlerContextType | undefined>(undefined)

interface ErrorHandlerProviderProps {
  children: ReactNode
}

export function ErrorHandlerProvider({ children }: ErrorHandlerProviderProps) {
  const handleError = useCallback((error: unknown, fallbackMessage = 'An unexpected error occurred') => {
    console.error('Error handled:', error)
    
    let message = fallbackMessage
    let title = 'Error'
    
    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = String(error.message)
    }
    
    // Handle API errors
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as any
      if (apiError.response?.data?.message) {
        message = apiError.response.data.message
      } else if (apiError.response?.status) {
        switch (apiError.response.status) {
          case 400:
            title = 'Invalid Request'
            message = 'Please check your input and try again'
            break
          case 401:
            title = 'Authentication Required'
            message = 'Please log in to continue'
            break
          case 403:
            title = 'Access Denied'
            message = 'You do not have permission to perform this action'
            break
          case 404:
            title = 'Not Found'
            message = 'The requested resource was not found'
            break
          case 422:
            title = 'Validation Error'
            message = 'Please check your input and try again'
            break
          case 429:
            title = 'Too Many Requests'
            message = 'Please wait a moment before trying again'
            break
          case 500:
            title = 'Server Error'
            message = 'Something went wrong on our end. Please try again later'
            break
          case 503:
            title = 'Service Unavailable'
            message = 'The service is temporarily unavailable. Please try again later'
            break
          default:
            title = 'Network Error'
            message = 'Unable to connect to the server. Please check your connection'
        }
      }
    }
    
    toast({
      variant: 'destructive',
      title,
      description: message,
    })
  }, [])

  const handleSuccess = useCallback((message: string, title = 'Success') => {
    toast({
      variant: 'success',
      title,
      description: message,
    })
  }, [])

  const handleWarning = useCallback((message: string, title = 'Warning') => {
    toast({
      variant: 'warning',
      title,
      description: message,
    })
  }, [])

  const handleInfo = useCallback((message: string, title = 'Info') => {
    toast({
      variant: 'info',
      title,
      description: message,
    })
  }, [])

  return (
    <ErrorHandlerContext.Provider value={{
      handleError,
      handleSuccess,
      handleWarning,
      handleInfo,
    }}>
      {children}
    </ErrorHandlerContext.Provider>
  )
}

export function useErrorHandler() {
  const context = useContext(ErrorHandlerContext)
  if (context === undefined) {
    throw new Error('useErrorHandler must be used within an ErrorHandlerProvider')
  }
  return context
}
