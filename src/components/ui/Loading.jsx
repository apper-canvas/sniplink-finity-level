import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Loading = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded w-48 animate-pulse"></div>
                    <div className="h-5 bg-accent/20 rounded-full w-16 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center py-8">
        <div className="inline-flex items-center space-x-2 text-gray-500">
          <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading your links...</span>
        </div>
      </div>
    </div>
  )
}

export default Loading