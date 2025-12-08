import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export interface WishlistItem {
  type: 'course' | 'academy'
  id: number
  slug: string
  name: string
  addedAt: string
}

const WISHLIST_STORAGE_KEY = 'iswo_wishlist'

/**
 * Hook para manejar cursos y academias guardados (wishlist)
 * 
 * Funcionalidad:
 * - Usuarios no autenticados: Se guarda en localStorage
 * - Usuarios autenticados: Se guarda en localStorage con el ID del usuario
 * - TODO: En el futuro, sincronizar con el backend cuando se implemente la API
 */
export function useWishlist() {
  const { user, isAuthenticated } = useAuthStore()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Obtener clave de almacenamiento según el usuario
  const getStorageKey = useCallback(() => {
    if (isAuthenticated && user?.id) {
      return `${WISHLIST_STORAGE_KEY}_user_${user.id}`
    }
    return WISHLIST_STORAGE_KEY
  }, [isAuthenticated, user?.id])

  // Cargar wishlist desde localStorage
  useEffect(() => {
    try {
      const storageKey = getStorageKey()
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setWishlist(JSON.parse(stored))
      }
    } catch (_error) {
      // console.error('Error loading wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }, [getStorageKey])

  // Guardar wishlist en localStorage
  const saveToStorage = useCallback(
    (items: WishlistItem[]) => {
      try {
        const storageKey = getStorageKey()
        localStorage.setItem(storageKey, JSON.stringify(items))
      } catch (_error) {
        // console.error('Error saving wishlist:', error)
      }
    },
    [getStorageKey]
  )

  // Verificar si un item está en la wishlist
  const isInWishlist = useCallback(
    (type: 'course' | 'academy', id: number) => {
      return wishlist.some((item) => item.type === type && item.id === id)
    },
    [wishlist]
  )

  // Agregar item a la wishlist
  const addToWishlist = useCallback(
    (type: 'course' | 'academy', id: number, slug: string, name: string) => {
      if (isInWishlist(type, id)) {
        return false
      }

      const newItem: WishlistItem = {
        type,
        id,
        slug,
        name,
        addedAt: new Date().toISOString(),
      }

      const updatedWishlist = [...wishlist, newItem]
      setWishlist(updatedWishlist)
      saveToStorage(updatedWishlist)
      return true
    },
    [wishlist, isInWishlist, saveToStorage]
  )

  // Remover item de la wishlist
  const removeFromWishlist = useCallback(
    (type: 'course' | 'academy', id: number) => {
      const updatedWishlist = wishlist.filter(
        (item) => !(item.type === type && item.id === id)
      )
      setWishlist(updatedWishlist)
      saveToStorage(updatedWishlist)
      return true
    },
    [wishlist, saveToStorage]
  )

  // Toggle: agregar o remover según el estado actual
  const toggleWishlist = useCallback(
    (type: 'course' | 'academy', id: number, slug: string, name: string) => {
      if (isInWishlist(type, id)) {
        removeFromWishlist(type, id)
        return false // Removido
      } else {
        addToWishlist(type, id, slug, name)
        return true // Agregado
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  )

  // Limpiar wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([])
    saveToStorage([])
  }, [saveToStorage])

  // Obtener items por tipo
  const getCourses = useCallback(() => {
    return wishlist.filter((item) => item.type === 'course')
  }, [wishlist])

  const getAcademies = useCallback(() => {
    return wishlist.filter((item) => item.type === 'academy')
  }, [wishlist])

  return {
    wishlist,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    getCourses,
    getAcademies,
    coursesCount: getCourses().length,
    academiesCount: getAcademies().length,
    totalCount: wishlist.length,
  }
}
