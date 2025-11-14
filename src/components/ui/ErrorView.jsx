import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="p-12 text-center bg-white/90 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {message}. Please try again or refresh the page.
          </p>
        </div>
        
        {onRetry && (
          <Button onClick={onRetry} className="inline-flex">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  )
}

export default ErrorView