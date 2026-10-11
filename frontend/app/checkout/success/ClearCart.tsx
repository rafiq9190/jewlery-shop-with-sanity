'use client'

import {useEffect} from 'react'

import {useCart} from '@/app/components/cart/CartProvider'

export default function ClearCart() {
  const {clear} = useCart()
  useEffect(() => clear(), [clear])
  return null
}
