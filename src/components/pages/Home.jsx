import React from 'react'
import URLShortener from '@/components/organisms/URLShortener'
import LinkHistory from '@/components/organisms/LinkHistory'

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Shorten. Share. Track.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your long URLs into powerful, trackable short links. Share with confidence and track engagement in real-time.
          </p>
        </div>
      </div>

      {/* URL Shortener Form */}
      <URLShortener />

      {/* Link History */}
      <LinkHistory />
    </div>
  )
}

export default Home