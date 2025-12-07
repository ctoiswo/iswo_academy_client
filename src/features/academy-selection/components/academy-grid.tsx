import { motion } from 'framer-motion'
import { Building } from 'lucide-react'
import { AcademyCard } from './academy-card'
import type { AcademyData, AcademyMembership } from '../types'

interface AcademyGridProps {
  academyData: AcademyData
  onSelect: (academy: AcademyMembership) => void
  isSelecting: boolean
}

export function AcademyGrid({ academyData, onSelect, isSelecting }: AcademyGridProps) {
  return (
    <>
      <motion.div 
        className="mb-8 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Building className="w-4 h-4" />
            Tienes acceso a <span className="font-semibold text-foreground">{academyData.count}</span> {academyData.count === 1 ? 'academia' : 'academias'}
          </p>
        </div>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {academyData.academies.map((academy, index) => (
          <motion.div
            key={academy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <AcademyCard
              academy={academy}
              onSelect={onSelect}
              isSelecting={isSelecting}
            />
          </motion.div>
        ))}
      </div>
    </>
  )
}