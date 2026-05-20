// /app/hooks/useCourses.ts
'use client'

import { useState, useEffect } from 'react'
import { Course } from '@/app/types'

// In-memory runtime cache object to prevent multiple component mounts from over-fetching your database API
let coursesCache: Course[] | null = null

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(coursesCache || [])
  const [loading, setLoading] = useState<boolean>(!coursesCache)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // FIX: If the cache is hot, we already initialized state with it above.
    // Just bail out of the effect completely without touching state synchronously.
    if (coursesCache) {
      return
    }

    let isMounted = true

    async function fetchFromDatabase() {
      try {
        setLoading(true)
        // Adjust endpoint string based on your working Next.js rewrite or direct API path
        const response = await fetch('/api/courses')

        if (!response.ok) {
          throw new Error(
            'Database communications failed to respond inside acceptable boundaries.',
          )
        }

        const json = await response.json()
        const data: Course[] = json.data || []

        coursesCache = data

        if (isMounted) {
          setCourses(data)
          setError(null)
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unknown database operational failure.',
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchFromDatabase()

    return () => {
      isMounted = false
    }
  }, [])

  // Programmatic mechanism to force sync updating down the line if needed
  const refetch = async () => {
    coursesCache = null
    setLoading(true)
    try {
      const response = await fetch('/api/courses')
      const json = await response.json()
      const data: Course[] = json.data || []
      coursesCache = data
      setCourses(data)
      setError(null)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Forced refresh database error.',
      )
    } finally {
      setLoading(false)
    }
  }

  return { courses, loading, error, refetch }
}
