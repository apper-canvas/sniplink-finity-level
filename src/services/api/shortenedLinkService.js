import mockLinks from '@/services/mockData/shortenedLinks.json'

const STORAGE_KEY = 'sniplink-data'

// Helper function to generate random short codes
const generateShortCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Helper function to get data from localStorage with fallback to mock data
const getData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // Initialize with mock data on first load
    const initialData = [...mockLinks]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
    return initialData
  } catch {
    return [...mockLinks]
  }
}

// Helper function to save data to localStorage
const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// Add delay to simulate API calls
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const shortenedLinkService = {
  async getAll() {
    await delay()
    return getData()
  },

  async getById(id) {
    await delay()
    const data = getData()
    return data.find(link => link.Id === parseInt(id))
  },

  async create(linkData) {
    await delay()
    const data = getData()
    
    // Find highest existing Id and add 1
    const maxId = data.length > 0 ? Math.max(...data.map(link => link.Id)) : 0
    
    // Generate unique short code
    let shortCode
    if (linkData.customAlias) {
      shortCode = linkData.customAlias.toLowerCase()
    } else {
      do {
        shortCode = generateShortCode()
      } while (data.some(link => link.shortCode === shortCode))
    }
    
    const newLink = {
      Id: maxId + 1,
      id: `link-${maxId + 1}`,
      shortCode: shortCode,
      originalUrl: linkData.originalUrl,
      customAlias: linkData.customAlias || null,
      clicks: 0,
      createdAt: new Date().toISOString(),
      lastClickedAt: null,
      isActive: true
    }
    
    data.push(newLink)
    saveData(data)
    return newLink
  },

  async update(id, updateData) {
    await delay()
    const data = getData()
    const index = data.findIndex(link => link.Id === parseInt(id))
    
    if (index === -1) {
      throw new Error('Link not found')
    }
    
    data[index] = { ...data[index], ...updateData }
    saveData(data)
    return data[index]
  },

  async delete(id) {
    await delay()
    const data = getData()
    const filteredData = data.filter(link => link.id !== id)
    saveData(filteredData)
    return true
  },

  async incrementClicks(linkId) {
    await delay(100)
    const data = getData()
    const linkIndex = data.findIndex(link => link.id === linkId)
    
    if (linkIndex !== -1) {
      data[linkIndex].clicks += 1
      data[linkIndex].lastClickedAt = new Date().toISOString()
      saveData(data)
      return data[linkIndex]
    }
    
    throw new Error('Link not found')
  }
}