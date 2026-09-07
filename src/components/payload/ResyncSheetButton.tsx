'use client'
import { useDocumentInfo, useTranslation } from '@payloadcms/ui'
import React, { useState } from 'react'

type Status = { message: string; type: 'success' | 'error' } | null

/**
 * „Kiírás újra" gomb a jelentkezés szerkesztő nézetének oldalsávjában.
 * A táblázat bekötése előtt vagy hiba miatt kimaradt jelentkezéseket utólag
 * is ki lehet írni vele a Google táblázatba.
 */
export const ResyncSheetButton = () => {
  const { id } = useDocumentInfo()
  const { i18n } = useTranslation()
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  const isHu = i18n.language !== 'en'

  if (!id) return null

  const handleClick = async () => {
    setPending(true)
    setStatus(null)

    try {
      const response = await fetch(`/api/job-applications/${id}/resync`, {
        method: 'POST',
        credentials: 'include',
      })
      const result = await response.json()

      if (result.status === 'ok') {
        setStatus({
          message: isHu ? 'Kiírva a táblázatba.' : 'Written to the spreadsheet.',
          type: 'success',
        })
      } else {
        setStatus({
          message: result.message ?? result.reason ?? (isHu ? 'Nem sikerült.' : 'Failed.'),
          type: 'error',
        })
      }
    } catch {
      setStatus({
        message: isHu ? 'A kérés nem ment át.' : 'The request failed.',
        type: 'error',
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="field-type">
      <button type="button" className="btn btn--style-secondary" onClick={handleClick} disabled={pending}>
        {pending
          ? isHu
            ? 'Kiírás…'
            : 'Writing…'
          : isHu
            ? 'Kiírás újra a táblázatba'
            : 'Write to spreadsheet again'}
      </button>

      {status && (
        <p style={{ marginTop: '0.5rem', color: status.type === 'error' ? 'var(--theme-error-500)' : 'var(--theme-success-500)' }}>
          {status.message}
        </p>
      )}
    </div>
  )
}
