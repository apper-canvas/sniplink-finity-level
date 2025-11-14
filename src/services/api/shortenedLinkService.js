import { getApperClient } from '@/services/apperClient'

// Helper function to generate random short codes
const generateShortCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const shortenedLinkService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.fetchRecords('shortened_link_c', {
        fields: [
          { field: { Name: 'Name' } },
          { field: { Name: 'original_url_c' } },
          { field: { Name: 'custom_alias_c' } },
          { field: { Name: 'clicks_c' } },
          { field: { Name: 'short_code_c' } },
          { field: { Name: 'is_active_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'last_clicked_at_c' } }
        ],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      })

      if (!response?.success) {
        console.error('Failed to fetch records:', response?.message || 'Unknown error')
        return []
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        Name: record.Name,
        originalUrl: record.original_url_c,
        customAlias: record.custom_alias_c,
        clicks: record.clicks_c || 0,
        shortCode: record.short_code_c,
        isActive: record.is_active_c,
        createdAt: record.CreatedOn,
        lastClickedAt: record.last_clicked_at_c
      }))
    } catch (error) {
      console.error('Error fetching all links:', error?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.getRecordById('shortened_link_c', parseInt(id), {
        fields: [
          { field: { Name: 'Name' } },
          { field: { Name: 'original_url_c' } },
          { field: { Name: 'custom_alias_c' } },
          { field: { Name: 'clicks_c' } },
          { field: { Name: 'short_code_c' } },
          { field: { Name: 'is_active_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'last_clicked_at_c' } }
        ]
      })

      if (!response?.data) {
        return null
      }

      return {
        Id: response.data.Id,
        Name: response.data.Name,
        originalUrl: response.data.original_url_c,
        customAlias: response.data.custom_alias_c,
        clicks: response.data.clicks_c || 0,
        shortCode: response.data.short_code_c,
        isActive: response.data.is_active_c,
        createdAt: response.data.CreatedOn,
        lastClickedAt: response.data.last_clicked_at_c
      }
    } catch (error) {
      console.error('Error fetching record by ID:', error?.message || error)
      return null
    }
  },

  async create(linkData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Generate unique short code
      let shortCode
      if (linkData.customAlias) {
        shortCode = linkData.customAlias.toLowerCase()
      } else {
        shortCode = generateShortCode()
      }

      const recordPayload = {
        records: [
          {
            Name: shortCode,
            original_url_c: linkData.originalUrl,
            custom_alias_c: linkData.customAlias || '',
            short_code_c: shortCode,
            clicks_c: 0,
            is_active_c: true,
            last_clicked_at_c: null
          }
        ]
      }

      const response = await apperClient.createRecord('shortened_link_c', recordPayload)

      if (!response?.success) {
        console.error('Failed to create record:', response?.message || 'Unknown error')
        throw new Error(response?.message || 'Failed to create shortened link')
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed)
          const errorMsg = failed[0]?.message || 'Failed to create shortened link'
          throw new Error(errorMsg)
        }

        if (successful.length > 0) {
          const created = successful[0].data
          return {
            Id: created.Id,
            Name: created.Name,
            originalUrl: created.original_url_c,
            customAlias: created.custom_alias_c,
            clicks: created.clicks_c || 0,
            shortCode: created.short_code_c,
            isActive: created.is_active_c,
            createdAt: created.CreatedOn,
            lastClickedAt: created.last_clicked_at_c
          }
        }
      }

      throw new Error('No records created')
    } catch (error) {
      console.error('Error creating link:', error?.message || error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const payload = {
        records: [
          {
            Id: parseInt(id),
            ...(updateData.clicks_c !== undefined && { clicks_c: updateData.clicks_c }),
            ...(updateData.last_clicked_at_c !== undefined && { last_clicked_at_c: updateData.last_clicked_at_c }),
            ...(updateData.is_active_c !== undefined && { is_active_c: updateData.is_active_c })
          }
        ]
      }

      const response = await apperClient.updateRecord('shortened_link_c', payload)

      if (!response?.success) {
        console.error('Failed to update record:', response?.message || 'Unknown error')
        throw new Error(response?.message || 'Failed to update link')
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed)
        }

        if (successful.length > 0) {
          const updated = successful[0].data
          return {
            Id: updated.Id,
            Name: updated.Name,
            originalUrl: updated.original_url_c,
            customAlias: updated.custom_alias_c,
            clicks: updated.clicks_c || 0,
            shortCode: updated.short_code_c,
            isActive: updated.is_active_c,
            createdAt: updated.CreatedOn,
            lastClickedAt: updated.last_clicked_at_c
          }
        }
      }

      throw new Error('Failed to update record')
    } catch (error) {
      console.error('Error updating link:', error?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.deleteRecord('shortened_link_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response?.success) {
        console.error('Failed to delete record:', response?.message || 'Unknown error')
        throw new Error(response?.message || 'Failed to delete link')
      }

      return true
    } catch (error) {
      console.error('Error deleting link:', error?.message || error)
      throw error
    }
  },

  async incrementClicks(linkId) {
    try {
      const link = await this.getById(linkId)
      if (!link) {
        throw new Error('Link not found')
      }

      const updated = await this.update(linkId, {
        clicks_c: (link.clicks || 0) + 1,
        last_clicked_at_c: new Date().toISOString()
      })

      return updated
    } catch (error) {
      console.error('Error incrementing clicks:', error?.message || error)
      throw error
    }
  }
}