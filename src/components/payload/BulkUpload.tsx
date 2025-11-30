'use client'
import { useForm, useTranslation } from '@payloadcms/ui'
import React, { useState } from 'react'

export const BulkUpload = () => {
  const { addFieldRow } = useForm()
  const { i18n } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setStatus({ 
      message: i18n.language === 'hu' 
        ? `${files.length} kép feltöltése...` 
        : `Uploading ${files.length} images...`,
      type: 'success'
    })

    let successCount = 0
    let failCount = 0
    let lastError = ''

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      
      // Generate alt text from filename, fallback to 'image' if empty
      const altText = file.name.split('.')[0] || 'image'
      
      formData.append('alt', altText)
      formData.append('file', file) 

      try {
        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const json = await res.json()
          
          // Add the uploaded image to the form using addFieldRow
          await addFieldRow({
            path: 'images',
            schemaPath: 'images',
            subFieldState: {
              image: {
                value: json.doc.id,
                valid: true,
                errorMessage: undefined,
                errorPaths: [],
              },
            },
          })
          
          successCount++
        } else {
            const errorText = await res.text()
            console.error('Upload failed for file:', file.name, res.status, errorText)
            failCount++
            lastError = `Status: ${res.status}`
        }
      } catch (err) {
        console.error('Error uploading file:', file.name, err)
        failCount++
        lastError = err instanceof Error ? err.message : 'Unknown error'
      }
    }

    setUploading(false)
    
    if (failCount > 0) {
        setStatus({
          message: i18n.language === 'hu'
            ? `${successCount} kép feltöltve. Sikertelen: ${failCount}. Hiba: ${lastError}`
            : `Uploaded ${successCount} images. Failed: ${failCount}. Last error: ${lastError}`,
          type: 'error'
        })
    } else {
        setStatus({
          message: i18n.language === 'hu'
            ? `${successCount} kép sikeresen feltöltve!`
            : `Successfully uploaded ${successCount} images!`,
          type: 'success'
        })
        // Clear the input
        e.target.value = ''
        // Clear status after 3 seconds
        setTimeout(() => setStatus(null), 3000)
    }
  }

  return (
    <div className="field-type ui">
      <div className="field-type-ui__wrap">
        <div style={{ 
          marginBottom: '1rem',
          padding: '1.5rem',
          border: '1px dashed var(--theme-elevation-150)',
          borderRadius: 'var(--border-radius-m)',
          backgroundColor: 'var(--theme-elevation-50)'
        }}>
          <label 
            className="field-label"
            style={{ 
              display: 'block', 
              marginBottom: '0.75rem',
              fontSize: 'var(--font-size-base)',
              fontWeight: 600,
              color: 'var(--theme-text)'
            }}
          >
            {i18n.language === 'hu' ? 'Tömeges képfeltöltés' : 'Bulk Upload Images'}
          </label>
          <p style={{ 
            fontSize: 'var(--font-size-sm)', 
            color: 'var(--theme-elevation-800)', 
            marginBottom: '1rem',
            lineHeight: 1.5
          }}>
            {i18n.language === 'hu' 
              ? 'Válassz ki több képet, hogy feltöltsd őket a Média könyvtárba és automatikusan hozzáadd ehhez a galériához.'
              : 'Select multiple images to upload them to the Media library and add them to this gallery automatically.'}
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="btn btn--style-secondary btn--size-medium"
            style={{ 
              display: 'block', 
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: 'var(--border-radius-s)',
              backgroundColor: 'var(--theme-input-bg)',
              color: 'var(--theme-text)',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          />
          {status && (
            <div 
              className={`render-fields__notification render-fields__notification--${status.type}`}
              style={{ 
                marginTop: '1rem', 
                padding: '0.75rem',
                borderRadius: 'var(--border-radius-s)',
                backgroundColor: status.type === 'success' 
                  ? 'var(--theme-success-50)' 
                  : 'var(--theme-error-50)',
                color: status.type === 'success' 
                  ? 'var(--theme-success-500)' 
                  : 'var(--theme-error-500)',
                border: `1px solid ${status.type === 'success' 
                  ? 'var(--theme-success-150)' 
                  : 'var(--theme-error-150)'}`,
                fontSize: 'var(--font-size-sm)'
              }}
            >
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
