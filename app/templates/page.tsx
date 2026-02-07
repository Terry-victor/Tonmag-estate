'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { TemplateLayout } from '@/components/template-layout'
import { TemplateSelector } from '@/components/template-selector'
import { houseTypesData, getHouseTypeById } from '@/lib/house-types-data'

export default function TemplatesPage() {
  const [selectedId, setSelectedId] = useState(houseTypesData[0].id)
  const selectedTemplate = getHouseTypeById(selectedId)

  if (!selectedTemplate) {
    return <div>Template not found</div>
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Template Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TemplateSelector selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      {/* Template Layout */}
      <TemplateLayout data={selectedTemplate} />

      <Footer />
    </main>
  )
}
