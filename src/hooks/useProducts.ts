"use client"
import { useState, useEffect, useCallback } from "react"
import { products as initialProducts } from "@/data/products"
import type { Product } from "@/types"

const LS_KEY = "z1-admin-products"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products?limit=50", { cache: "no-store" })
      if (!res.ok) throw new Error("fetch failed")
      const data = await res.json()
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        // Merge with local admin products if any (for offline fallback)
        try {
          const saved = localStorage.getItem(LS_KEY)
          if (saved) {
            const admin: Product[] = JSON.parse(saved)
            const apiSlugs = new Set(data.products.map((p: Product) => p.slug))
            const extra = admin.filter((p) => !apiSlugs.has(p.slug))
            setProducts([...data.products, ...extra])
          } else {
            setProducts(data.products)
          }
        } catch {
          setProducts(data.products)
        }
      } else {
        // fallback to local
        const saved = localStorage.getItem(LS_KEY)
        if (saved) {
          try {
            const admin: Product[] = JSON.parse(saved)
            const slugs = new Set(admin.map((p) => p.slug))
            setProducts([...admin, ...initialProducts.filter((p) => !slugs.has(p.slug))])
          } catch {
            setProducts(initialProducts)
          }
        } else {
          setProducts(initialProducts)
        }
      }
    } catch {
      // network error → fallback to localStorage + initial
      try {
        const saved = localStorage.getItem(LS_KEY)
        if (saved) {
          const admin: Product[] = JSON.parse(saved)
          const slugs = new Set(admin.map((p) => p.slug))
          setProducts([...admin, ...initialProducts.filter((p) => !slugs.has(p.slug))])
        } else {
          setProducts(initialProducts)
        }
      } catch {
        setProducts(initialProducts)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
    const onStorage = (e: StorageEvent) => { if (e.key === LS_KEY) fetchProducts() }
    const onUpdate = () => fetchProducts()
    window.addEventListener("storage", onStorage)
    window.addEventListener("z1-products-update", onUpdate as EventListener)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("z1-products-update", onUpdate as EventListener)
    }
  }, [fetchProducts])

  return products
}

export function useProductsWithMeta() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/products?limit=50")
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      setProducts(data.products || initialProducts)
    } catch (e) {
      setError("Failed to load")
      setProducts(initialProducts)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  return { products, loading, error, refetch: fetchProducts }
}

export function notifyProductsUpdate() {
  window.dispatchEvent(new Event("z1-products-update"))
}