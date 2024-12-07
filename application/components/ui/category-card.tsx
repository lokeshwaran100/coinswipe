"use client"

import { LucideIcon } from 'lucide-react'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    icon: LucideIcon
    description: string
    color: string
  }
  onClick: () => void
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const Icon = category.icon

  return (
    <button
      onClick={onClick}
      className="w-full p-6 rounded-xl bg-card hover:bg-accent transition-colors duration-200 group"
    >
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-left group-hover:text-primary transition-colors">
        {category.name}
      </h3>
      <p className="text-sm text-muted-foreground text-left">
        {category.description}
      </p>
    </button>
  )
}