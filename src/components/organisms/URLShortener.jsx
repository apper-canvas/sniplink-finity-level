import React, { useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { shortenedLinkService } from "@/services/api/shortenedLinkService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
const URLShortener = () => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: ''
  })
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState(null)
  const [errors, setErrors] = useState({})

  const validateUrl = (url) => {
    try {
      const urlPattern = /^https?:\/\/.+\..+/
      return urlPattern.test(url)
    } catch {
      return false
    }
  }

const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset previous state
    setErrors({})
    setGeneratedLink(null)
    
    // Validation
    const newErrors = {}
    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = "Please enter a URL to shorten"
    } else if (!validateUrl(formData.originalUrl.trim())) {
      newErrors.originalUrl = "Please enter a valid URL (must start with http:// or https://)"
    }
    
    if (formData.customAlias.trim()) {
      const existingLinks = await shortenedLinkService.getAll()
      const aliasExists = existingLinks.some(link => 
        link.shortCode === formData.customAlias.trim().toLowerCase() || 
        link.customAlias === formData.customAlias.trim().toLowerCase()
      )
      if (aliasExists) {
        newErrors.customAlias = "This custom alias is already taken"
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    try {
      setLoading(true)
      const linkData = {
        originalUrl: formData.originalUrl.trim(),
        customAlias: formData.customAlias.trim() || undefined
      }
      const newLink = await shortenedLinkService.create(linkData)
      setGeneratedLink(newLink)
      setFormData({ originalUrl: '', customAlias: '' })
      toast.success("Short link created successfully!")
      
      // Trigger page refresh for header counter
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      toast.error(error?.message || "Failed to create short link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success("Link copied to clipboard!")
    }
  }

  const shortUrl = generatedLink ? `https://snip.link/${generatedLink.shortCode}` : ''

  return (
    <div className="space-y-8">
      {/* Main Form */}
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Enter your long URL
            </label>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://example.com/your-very-long-url-here"
                value={formData.originalUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
                className={`h-14 text-lg pr-12 ${errors.originalUrl ? 'border-red-500 focus:border-red-500' : ''}`}
                autoFocus
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <ApperIcon name="Link" className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {errors.originalUrl && (
              <p className="text-sm text-red-500 mt-1">{errors.originalUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Custom alias (optional)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                snip.link/
              </div>
              <Input
                type="text"
                placeholder="my-custom-link"
                value={formData.customAlias}
                onChange={(e) => setFormData(prev => ({ ...prev, customAlias: e.target.value }))}
                className={`h-12 pl-24 ${errors.customAlias ? 'border-red-500 focus:border-red-500' : ''}`}
              />
            </div>
            {errors.customAlias && (
              <p className="text-sm text-red-500 mt-1">{errors.customAlias}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg font-bold"
            size="lg"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                Creating Link...
              </>
            ) : (
              <>
                <ApperIcon name="Scissors" className="w-5 h-5 mr-2" />
                Shorten URL
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Generated Link Display */}
      <AnimatePresence>
        {generatedLink && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CheckCircle" className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Your short link is ready!
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white/80 rounded-lg border border-gray-200">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="text-sm text-gray-600 mb-1">Short URL</div>
                      <div className="text-xl font-bold text-primary truncate">
                        {shortUrl}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCopy(shortUrl)}
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600 bg-white/50 p-3 rounded-lg">
                    <div className="font-medium mb-1">Original URL:</div>
                    <div className="truncate">{generatedLink.originalUrl}</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default URLShortener