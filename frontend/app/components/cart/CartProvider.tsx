'use client'

import {createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState} from 'react'

/**
 * Cart state lives in the browser. The name/price/image snapshot is for display only:
 * checkout re-prices every line from Sanity on the server (see app/checkout/actions.ts).
 */

export type CartLine = {
  productId: string
  variantKey: string | null
  variantLabel: string | null
  name: string
  slug: string
  price: number
  imageRef: string | null
  quantity: number
}

type Action =
  | {type: 'add'; line: CartLine}
  | {type: 'setQuantity'; productId: string; variantKey: string | null; quantity: number}
  | {type: 'clear'}
  | {type: 'hydrate'; lines: CartLine[]}

const STORAGE_KEY = 'aurelia-bag'
const MAX_QUANTITY = 10

const sameLine = (a: Pick<CartLine, 'productId' | 'variantKey'>, productId: string, variantKey: string | null) =>
  a.productId === productId && a.variantKey === variantKey

function reducer(lines: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'hydrate':
      return action.lines
    case 'clear':
      return []
    case 'add': {
      const {line} = action
      const existing = lines.find((l) => sameLine(l, line.productId, line.variantKey))
      if (!existing) return [...lines, line]
      return lines.map((l) =>
        l === existing ? {...l, quantity: Math.min(MAX_QUANTITY, l.quantity + line.quantity)} : l,
      )
    }
    case 'setQuantity':
      return lines
        .map((l) =>
          sameLine(l, action.productId, action.variantKey)
            ? {...l, quantity: Math.min(MAX_QUANTITY, action.quantity)}
            : l,
        )
        .filter((l) => l.quantity > 0)
  }
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  open: () => void
  close: () => void
  add: (line: CartLine) => void
  setQuantity: (productId: string, variantKey: string | null, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({children}: {children: React.ReactNode}) {
  const [lines, dispatch] = useReducer(reducer, [])
  const [isOpen, setIsOpen] = useState(false)
  const hydrated = useRef(false)

  // Declared before the restore effect so the first (empty) render is never written over the saved bag
  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Ignore quota / private mode errors
    }
  }, [lines])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) dispatch({type: 'hydrate', lines: JSON.parse(stored)})
    } catch {
      // Storage unavailable or corrupt: start with an empty bag
    }
    hydrated.current = true
  }, [])

  const add = useCallback((line: CartLine) => {
    dispatch({type: 'add', line})
    setIsOpen(true)
  }, [])
  const setQuantity = useCallback(
    (productId: string, variantKey: string | null, quantity: number) =>
      dispatch({type: 'setQuantity', productId, variantKey, quantity}),
    [],
  )
  const clear = useCallback(() => dispatch({type: 'clear'}), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      isOpen,
      open,
      close,
      add,
      setQuantity,
      clear,
    }),
    [lines, isOpen, open, close, add, setQuantity, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
