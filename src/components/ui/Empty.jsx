import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const Empty = () => {
  return (
    <Card className="p-12 text-center bg-white/90 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="Link" className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            No links yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Start by shortening your first URL above. All your created links will appear here with click tracking and easy management.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 max-w-sm mx-auto">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary shrink-0" />
            <span>
              <strong>Tip:</strong> Try pasting a long URL like "https://example.com/very-long-path" to get started!
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Empty