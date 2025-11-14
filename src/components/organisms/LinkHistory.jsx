import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Empty from '@/components/ui/Empty'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import { shortenedLinkService } from '@/services/api/shortenedLinkService'
const LinkHistory = () => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadLinks = async () => {
    setLoading(true)
    setError('')
    try {
const allLinks = await shortenedLinkService.getAll()
      setLinks(allLinks || [])
    } catch (err) {
      setError('Failed to load link history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLinks()
    
    // Listen for storage events to refresh when new links are added
    const handleStorageChange = () => {
      loadLinks()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success("Link copied to clipboard!")
    }
  }

  const handleClick = async (linkId) => {
    try {
await shortenedLinkService.incrementClicks(linkId)
      await loadLinks()
    } catch (err) {
      console.error('Failed to track click:', err)
    }
  }

  const handleDelete = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return
    
    try {
await shortenedLinkService.delete(linkId)
      toast.success("Link deleted successfully!")
      await loadLinks()
      loadLinks()
      // Trigger header refresh
      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      toast.error("Failed to delete link")
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadLinks} />
  }

  if (links.length === 0) {
    return <Empty />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your Links
        </h2>
        <div className="text-sm text-gray-500">
          {links.length} link{links.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
{links.map((link, index) => {
            const shortUrl = `https://snip.link/${link.shortCode}`
            const createdTime = formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })
            
            return (
              <motion.div
                key={link.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-white/90 backdrop-blur-sm">
                  <div className="space-y-4">
                    {/* Header with short URL and actions */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="text-lg font-bold text-primary cursor-pointer hover:text-secondary transition-colors duration-200"
                            onClick={() => handleClick(link.Id)}
                          >
                            {shortUrl}
                          </div>
                          <Badge variant="success" className="shrink-0">
                            <ApperIcon name="MousePointer" className="w-3 h-3 mr-1" />
                            {link.clicks} click{link.clicks !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 truncate">
                          <ApperIcon name="ExternalLink" className="w-4 h-4 inline mr-2" />
                          {link.originalUrl}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Calendar" className="w-3 h-3" />
                            <span>Created {createdTime}</span>
                          </div>
                          {link.lastClickedAt && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Clock" className="w-3 h-3" />
                              <span>Last clicked {formatDistanceToNow(new Date(link.lastClickedAt), { addSuffix: true })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          onClick={() => handleCopy(shortUrl)}
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                        >
                          <ApperIcon name="Copy" className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(link.id)}
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Custom alias indicator */}
{link.customAlias && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" size="sm">
                          <ApperIcon name="Edit3" className="w-3 h-3 mr-1" />
                          Custom Alias
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default LinkHistory