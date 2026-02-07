'use client'

import { houseTypesData } from '@/lib/house-types-data'

interface TemplateSelectorProps {
  selectedId: string
  onSelect: (id: string) => void
}

export function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-lg border border-border">
      <label htmlFor="template-select" className="text-sm font-medium text-foreground">
        Select Template:
      </label>
      <select
        id="template-select"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:border-primary transition-colors cursor-pointer"
      >
        {houseTypesData.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
    </div>
  )
}
