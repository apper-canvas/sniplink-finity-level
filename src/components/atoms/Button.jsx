import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 focus:ring-primary shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 focus:ring-primary",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-primary focus:ring-primary",
    success: "bg-gradient-to-r from-accent to-emerald-600 text-white hover:from-accent/90 hover:to-emerald-600/90 focus:ring-accent shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
  }
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button