import { type ReactElement, useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { UserBadge } from '@/types'
import { Share2, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface BadgeModalProps {
  badge: UserBadge | null
  open: boolean
  onClose: () => void
}

// ─── Badge visual config ──────────────────────────────────────────────────────

interface BadgeVisualConfig {
  gradient: string
  glowColor: string
  ringColor: string
}

// Per-slug overrides; fallback determined by tier
const slugConfigs: Partial<Record<string, BadgeVisualConfig>> = {
  'account-confirmed': {
    gradient: 'from-indigo-500 via-primary to-indigo-400',
    glowColor: 'rgba(99,102,241,0.4)',
    ringColor: 'border-indigo-400/50',
  },
  'first-video': {
    gradient: 'from-amber-500 via-orange-400 to-yellow-400',
    glowColor: 'rgba(251,146,60,0.4)',
    ringColor: 'border-amber-400/50',
  },
  'first-lesson': {
    gradient: 'from-emerald-500 via-emerald-400 to-teal-400',
    glowColor: 'rgba(52,211,153,0.4)',
    ringColor: 'border-emerald-400/50',
  },
  'first-course': {
    gradient: 'from-teal-500 via-emerald-400 to-green-400',
    glowColor: 'rgba(20,184,166,0.4)',
    ringColor: 'border-teal-400/50',
  },
  'first-quiz': {
    gradient: 'from-sky-500 via-cyan-400 to-teal-400',
    glowColor: 'rgba(14,165,233,0.4)',
    ringColor: 'border-sky-400/50',
  },
  'first-certificate': {
    gradient: 'from-violet-500 via-purple-400 to-fuchsia-400',
    glowColor: 'rgba(167,139,250,0.4)',
    ringColor: 'border-violet-400/50',
  },
  'five-courses': {
    gradient: 'from-purple-500 via-violet-400 to-indigo-400',
    glowColor: 'rgba(139,92,246,0.4)',
    ringColor: 'border-purple-400/50',
  },
  'ten-lessons': {
    gradient: 'from-blue-500 via-indigo-400 to-violet-400',
    glowColor: 'rgba(59,130,246,0.4)',
    ringColor: 'border-blue-400/50',
  },
  'ten-courses': {
    gradient: 'from-yellow-400 via-amber-400 to-orange-400',
    glowColor: 'rgba(251,191,36,0.4)',
    ringColor: 'border-yellow-400/50',
  },
  'hundred-lessons': {
    gradient: 'from-orange-500 via-amber-400 to-yellow-300',
    glowColor: 'rgba(249,115,22,0.4)',
    ringColor: 'border-orange-400/50',
  },
  perfectionist: {
    gradient: 'from-sky-500 via-cyan-400 to-teal-300',
    glowColor: 'rgba(14,165,233,0.4)',
    ringColor: 'border-sky-400/50',
  },
  'ace-student': {
    gradient: 'from-yellow-400 via-amber-300 to-orange-400',
    glowColor: 'rgba(251,191,36,0.4)',
    ringColor: 'border-yellow-300/50',
  },
  speedster: {
    gradient: 'from-lime-500 via-green-400 to-emerald-400',
    glowColor: 'rgba(132,204,22,0.4)',
    ringColor: 'border-lime-400/50',
  },
  'first-comment': {
    gradient: 'from-pink-500 via-rose-400 to-red-400',
    glowColor: 'rgba(236,72,153,0.4)',
    ringColor: 'border-pink-400/50',
  },
  'helpful-member': {
    gradient: 'from-teal-500 via-emerald-400 to-green-400',
    glowColor: 'rgba(20,184,166,0.4)',
    ringColor: 'border-teal-400/50',
  },
  'discussion-starter': {
    gradient: 'from-rose-500 via-pink-400 to-fuchsia-400',
    glowColor: 'rgba(244,63,94,0.4)',
    ringColor: 'border-rose-400/50',
  },
  'community-leader': {
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
    glowColor: 'rgba(124,58,237,0.4)',
    ringColor: 'border-violet-500/50',
  },
  'week-warrior': {
    gradient: 'from-orange-500 via-amber-400 to-yellow-400',
    glowColor: 'rgba(251,146,60,0.4)',
    ringColor: 'border-orange-400/50',
  },
  'month-master': {
    gradient: 'from-red-500 via-orange-500 to-amber-400',
    glowColor: 'rgba(239,68,68,0.4)',
    ringColor: 'border-red-400/50',
  },
  'year-legend': {
    gradient: 'from-blue-600 via-violet-500 to-purple-500',
    glowColor: 'rgba(99,102,241,0.5)',
    ringColor: 'border-blue-400/50',
  },
  'night-owl': {
    gradient: 'from-indigo-600 via-violet-500 to-purple-500',
    glowColor: 'rgba(99,102,241,0.4)',
    ringColor: 'border-indigo-400/50',
  },
  'early-bird': {
    gradient: 'from-yellow-400 via-amber-400 to-orange-400',
    glowColor: 'rgba(251,191,36,0.4)',
    ringColor: 'border-yellow-400/50',
  },
  'weekend-learner': {
    gradient: 'from-cyan-500 via-sky-400 to-blue-400',
    glowColor: 'rgba(6,182,212,0.4)',
    ringColor: 'border-cyan-400/50',
  },
  'renaissance-person': {
    gradient: 'from-fuchsia-500 via-violet-500 to-indigo-500',
    glowColor: 'rgba(217,70,239,0.4)',
    ringColor: 'border-fuchsia-400/50',
  },
  'course-collector': {
    gradient: 'from-emerald-500 via-teal-400 to-cyan-400',
    glowColor: 'rgba(16,185,129,0.4)',
    ringColor: 'border-emerald-400/50',
  },
  'certificate-hunter': {
    gradient: 'from-amber-500 via-yellow-400 to-orange-300',
    glowColor: 'rgba(245,158,11,0.4)',
    ringColor: 'border-amber-400/50',
  },
  'level-10': {
    gradient: 'from-sky-500 via-blue-400 to-indigo-400',
    glowColor: 'rgba(14,165,233,0.4)',
    ringColor: 'border-sky-400/50',
  },
  'level-25': {
    gradient: 'from-yellow-500 via-amber-400 to-orange-400',
    glowColor: 'rgba(234,179,8,0.4)',
    ringColor: 'border-yellow-400/50',
  },
  'level-50': {
    gradient: 'from-cyan-400 via-teal-400 to-emerald-400',
    glowColor: 'rgba(20,184,166,0.4)',
    ringColor: 'border-cyan-400/50',
  },
  'secret-explorer': {
    gradient: 'from-slate-600 via-purple-600 to-indigo-500',
    glowColor: 'rgba(124,58,237,0.5)',
    ringColor: 'border-purple-500/50',
  },
  'first-course-created': {
    gradient: 'from-blue-500 via-indigo-400 to-violet-400',
    glowColor: 'rgba(59,130,246,0.4)',
    ringColor: 'border-blue-400/50',
  },
  'first-lesson-created': {
    gradient: 'from-sky-500 via-cyan-400 to-teal-400',
    glowColor: 'rgba(14,165,233,0.4)',
    ringColor: 'border-sky-400/50',
  },
  'first-assessment-created': {
    gradient: 'from-emerald-500 via-green-400 to-teal-400',
    glowColor: 'rgba(16,185,129,0.4)',
    ringColor: 'border-emerald-400/50',
  },
  'first-learning-path-created': {
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-400',
    glowColor: 'rgba(139,92,246,0.4)',
    ringColor: 'border-violet-400/50',
  },
  'first-certificate-created': {
    gradient: 'from-amber-500 via-orange-400 to-yellow-400',
    glowColor: 'rgba(251,146,60,0.4)',
    ringColor: 'border-amber-400/50',
  },
}

const tierFallbacks: Record<string, BadgeVisualConfig> = {
  bronze: {
    gradient: 'from-orange-600 via-amber-500 to-yellow-400',
    glowColor: 'rgba(217,119,6,0.4)',
    ringColor: 'border-amber-500/50',
  },
  silver: {
    gradient: 'from-slate-400 via-gray-300 to-slate-400',
    glowColor: 'rgba(148,163,184,0.4)',
    ringColor: 'border-slate-400/50',
  },
  gold: {
    gradient: 'from-yellow-400 via-amber-400 to-orange-300',
    glowColor: 'rgba(251,191,36,0.4)',
    ringColor: 'border-yellow-400/50',
  },
  platinum: {
    gradient: 'from-cyan-400 via-teal-400 to-emerald-400',
    glowColor: 'rgba(20,184,166,0.4)',
    ringColor: 'border-cyan-400/50',
  },
  diamond: {
    gradient: 'from-blue-500 via-violet-500 to-purple-400',
    glowColor: 'rgba(99,102,241,0.5)',
    ringColor: 'border-blue-400/50',
  },
}

function getVisualConfig(slug: string, tier: string): BadgeVisualConfig {
  return slugConfigs[slug] ?? tierFallbacks[tier] ?? tierFallbacks.bronze
}

// ─── Custom SVG badge icons ────────────────────────────────────────────────────

function BadgeIcon({ slug, className }: { slug: string; className?: string }) {
  const icons: Record<string, ReactElement> = {
    'account-confirmed': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="24" width="48" height="34" rx="4" stroke="currentColor" strokeWidth="2.5" opacity="0.4" />
        <path d="M16 30L40 48L64 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        <circle cx="56" cy="56" r="13" fill="currentColor" opacity="0.9" />
        <path d="M50 56L54 60L62 52" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'first-video': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="22" width="44" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" opacity="0.4" />
        <path d="M54 33L70 26V50L54 43V33Z" fill="currentColor" opacity="0.7" />
        <path d="M28 32L44 40L28 48V32Z" fill="currentColor" opacity="0.9" />
      </svg>
    ),
    'first-lesson': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="16" width="36" height="46" rx="3" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
        <path d="M26 28H54M26 36H54M26 44H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 52L56 46L64 58L58 62L50 52Z" fill="currentColor" opacity="0.8" />
        <circle cx="60" cy="52" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    'first-course': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 14L50 22H64L54 32L58 46L40 36L22 46L26 32L16 22H30L40 14Z" fill="currentColor" opacity="0.75" />
        <path d="M24 58H56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <path d="M30 64H50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
    'first-quiz': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="12" width="44" height="54" rx="4" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
        <rect x="26" y="20" width="28" height="6" rx="2" fill="currentColor" opacity="0.5" />
        <path d="M26 36H36M26 44H36M26 52H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M42 34L46 38L54 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 42L46 46L54 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'first-certificate': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="20" width="56" height="38" rx="4" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
        <path d="M24 36H56M24 44H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <circle cx="58" cy="58" r="12" fill="currentColor" opacity="0.9" />
        <path d="M53 58L57 62L64 54" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M52 66L58 70L64 66V76L58 72L52 76V66Z" fill="currentColor" opacity="0.6" />
      </svg>
    ),
    'five-courses': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="26" y="48" width="28" height="18" rx="2" fill="currentColor" opacity="0.8" />
        <rect x="22" y="38" width="28" height="14" rx="2" fill="currentColor" opacity="0.7" />
        <rect x="18" y="28" width="28" height="14" rx="2" fill="currentColor" opacity="0.6" />
        <rect x="14" y="18" width="28" height="14" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="10" y="8" width="28" height="14" rx="2" fill="currentColor" opacity="0.4" />
        <path d="M58 28L62 38L72 38L64 44L67 54L58 48L49 54L52 44L44 38L54 38L58 28Z" fill="currentColor" opacity="0.9" />
      </svg>
    ),
    'ten-lessons': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="16" width="30" height="40" rx="3" stroke="currentColor" strokeWidth="2.5" opacity="0.4" />
        <path d="M22 28H40M22 36H36M22 44H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <text x="54" y="52" textAnchor="middle" fontSize="22" fontWeight="bold" fill="currentColor">10</text>
      </svg>
    ),
    'ten-courses': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 10L46 26H64L50 36L56 52L40 42L24 52L30 36L16 26H34L40 10Z" fill="currentColor" opacity="0.9" />
        <path d="M26 62H54M30 70H50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    'hundred-lessons': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="3" opacity="0.3" />
        <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <circle cx="40" cy="40" r="12" fill="currentColor" opacity="0.85" />
        <text x="40" y="45" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">100</text>
        <path d="M58 22L62 18M22 58L18 62M58 58L62 62M22 22L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    perfectionist: (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
        <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <circle cx="40" cy="40" r="13" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <circle cx="40" cy="40" r="6" fill="currentColor" opacity="0.9" />
        <path d="M40 12V16M40 64V68M12 40H16M64 40H68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    'ace-student': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 8L44 20H56L46 28L50 40L40 32L30 40L34 28L24 20H36L40 8Z" fill="currentColor" />
        <path d="M18 30L21 40H30L23 46L25 56L18 50L11 56L13 46L6 40H15L18 30Z" fill="currentColor" opacity="0.7" />
        <path d="M62 30L65 40H74L67 46L69 56L62 50L55 56L57 46L50 40H59L62 30Z" fill="currentColor" opacity="0.7" />
        <path d="M28 66L31 74H36L32 78L33 84L28 80L23 84L24 78L20 74H25L28 66Z" fill="currentColor" opacity="0.5" />
        <path d="M52 66L55 74H60L56 78L57 84L52 80L47 84L48 78L44 74H49L52 66Z" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    speedster: (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44 12L28 44H40L36 68L56 36H44L52 12H44Z" fill="currentColor" opacity="0.9" />
        <path d="M16 44H22M20 34L24 37M20 54L24 51" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    'first-comment': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 18H66C67.1 18 68 18.9 68 20V52C68 53.1 67.1 54 66 54H36L24 66V54H14C12.9 54 12 53.1 12 52V20C12 18.9 12.9 18 14 18Z" fill="currentColor" opacity="0.75" />
        <path d="M24 32H56M24 42H44" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    'helpful-member': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 38C20 32 24 26 32 26C36 26 40 28 40 28C40 28 44 26 48 26C56 26 60 32 60 38C60 48 40 62 40 62C40 62 20 48 20 38Z" fill="currentColor" opacity="0.8" />
        <path d="M30 56L36 62L50 48" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="60" cy="22" r="8" fill="currentColor" opacity="0.6" />
        <path d="M58 22H62M60 20V24" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'discussion-starter': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 14H50C51.1 14 52 14.9 52 16V40C52 41.1 51.1 42 50 42H26L16 52V42H8C6.9 42 6 41.1 6 40V16C6 14.9 6.9 14 8 14Z" fill="currentColor" opacity="0.6" />
        <path d="M30 28H44C45.1 28 46 28.9 46 30V50C46 51.1 45.1 52 44 52H36L28 60V52H30C28.9 52 28 51.1 28 50V30C28 28.9 28.9 28 30 28Z" fill="currentColor" opacity="0.85" />
        <path d="M36 36H42M36 43H40" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'community-leader': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="22" r="10" fill="currentColor" opacity="0.9" />
        <path d="M22 56C22 44 30 40 40 40C50 40 58 44 58 56" fill="currentColor" opacity="0.7" />
        <circle cx="16" cy="28" r="7" fill="currentColor" opacity="0.6" />
        <path d="M4 56C4 46 9 43 16 43C20 43 24 45 24 45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="64" cy="28" r="7" fill="currentColor" opacity="0.6" />
        <path d="M76 56C76 46 71 43 64 43C60 43 56 45 56 45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        <path d="M32 14L36 20H44L38 24L40 32L32 28L24 32L26 24L20 20H28L32 14Z" fill="white" opacity="0.6" />
      </svg>
    ),
    'week-warrior': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 12C40 12 28 26 28 42C28 52 34 60 40 62C46 60 52 52 52 42C52 26 40 12 40 12Z" fill="currentColor" opacity="0.8" />
        <path d="M40 24C40 24 34 32 34 42C34 48 37 52 40 53C43 52 46 48 46 42C46 32 40 24 40 24Z" fill="currentColor" />
        <circle cx="40" cy="42" r="4" fill="white" opacity="0.9" />
        <text x="40" y="74" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">7</text>
      </svg>
    ),
    'month-master': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 10C40 10 24 26 24 44C24 56 32 66 40 68C48 66 56 56 56 44C56 26 40 10 40 10Z" fill="currentColor" opacity="0.6" />
        <path d="M40 18C40 18 30 30 30 44C30 52 35 58 40 59C45 58 50 52 50 44C50 30 40 18 40 18Z" fill="currentColor" opacity="0.8" />
        <path d="M40 28C40 28 36 36 36 44C36 48 38 51 40 52C42 51 44 48 44 44C44 36 40 28 40 28Z" fill="currentColor" />
        <circle cx="40" cy="44" r="3" fill="white" />
        <text x="40" y="78" textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor">30</text>
      </svg>
    ),
    'year-legend': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 8C40 8 20 16 20 40C20 58 30 72 40 74C50 72 60 58 60 40C60 16 40 8 40 8Z" fill="currentColor" opacity="0.5" />
        <path d="M40 16C40 16 28 22 28 40C28 54 34 64 40 66C46 64 52 54 52 40C52 22 40 16 40 16Z" fill="currentColor" opacity="0.7" />
        <path d="M40 24C40 24 34 28 34 40C34 50 37 56 40 57C43 56 46 50 46 40C46 28 40 24 40 24Z" fill="currentColor" opacity="0.9" />
        <path d="M33 8L36 14H42L37 18L39 24L33 20L27 24L29 18L24 14H30L33 8Z" fill="white" opacity="0.7" />
        <circle cx="40" cy="40" r="4" fill="white" />
      </svg>
    ),
    'night-owl': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="36" r="20" fill="currentColor" opacity="0.7" />
        <ellipse cx="32" cy="34" rx="6" ry="7" fill="white" />
        <ellipse cx="48" cy="34" rx="6" ry="7" fill="white" />
        <circle cx="32" cy="35" r="3" fill="currentColor" />
        <circle cx="48" cy="35" r="3" fill="currentColor" />
        <path d="M36 44L40 48L44 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 28C18 24 20 18 26 16M60 28C62 24 60 18 54 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <circle cx="62" cy="18" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path d="M66 14C66 14 70 16 70 22C70 26 66 28 66 28" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
    'early-bird': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="30" r="16" fill="currentColor" opacity="0.8" />
        <path d="M18 30H62M40 14V10M52 18L56 14M28 18L24 14M60 30L64 26M20 30L16 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <ellipse cx="40" cy="55" rx="18" ry="10" fill="currentColor" opacity="0.6" />
        <path d="M30 52L32 48L34 52L32 56Z M46 52L48 48L50 52L48 56Z" fill="currentColor" />
      </svg>
    ),
    'weekend-learner': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="20" width="52" height="44" rx="4" stroke="currentColor" strokeWidth="2.5" opacity="0.4" />
        <path d="M14 32H66" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <path d="M28 14V22M52 14V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 44H34M26 52H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M46 44H54M46 52H54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <circle cx="40" cy="48" r="8" fill="currentColor" opacity="0.25" />
        <path d="M37 44V52M41 44V52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M37 48H43" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'renaissance-person': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="24" height="24" rx="3" fill="currentColor" opacity="0.7" />
        <rect x="46" y="10" width="24" height="24" rx="3" fill="currentColor" opacity="0.7" />
        <rect x="10" y="46" width="24" height="24" rx="3" fill="currentColor" opacity="0.7" />
        <rect x="46" y="46" width="24" height="24" rx="3" fill="currentColor" opacity="0.7" />
        <path d="M18 22L22 26L30 18M54 22L58 26L66 18M18 58L22 62L30 54" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M54 58H66M60 52V64" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'course-collector': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="42" width="25" height="28" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="18" y="32" width="25" height="28" rx="2" fill="currentColor" opacity="0.65" />
        <rect x="26" y="22" width="25" height="28" rx="2" fill="currentColor" opacity="0.8" />
        <rect x="34" y="12" width="25" height="28" rx="2" fill="currentColor" opacity="0.95" />
        <path d="M38 22H56M38 28H50M38 34H52" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="62" cy="58" r="10" fill="currentColor" opacity="0.9" />
        <path d="M58 58L61 61L67 54" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'certificate-hunter': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="34" cy="34" r="18" stroke="currentColor" strokeWidth="3" opacity="0.6" />
        <circle cx="34" cy="34" r="11" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <path d="M47 47L62 62" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M26 34H42M34 26V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M60 56C60 56 66 62 68 66L64 70C60 68 54 62 54 62L60 56Z" fill="currentColor" opacity="0.7" />
      </svg>
    ),
    'level-10': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 10L62 22V54L40 66L18 54V22L40 10Z" stroke="currentColor" strokeWidth="2.5" opacity="0.4" />
        <path d="M40 20L56 30V50L40 60L24 50V30L40 20Z" fill="currentColor" opacity="0.7" />
        <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">10</text>
      </svg>
    ),
    'level-25': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 8L64 20V56L40 68L16 56V20L40 8Z" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
        <path d="M40 16L58 26V50L40 60L22 50V26L40 16Z" fill="currentColor" opacity="0.55" />
        <path d="M40 24L52 32V46L40 54L28 46V32L40 24Z" fill="currentColor" opacity="0.85" />
        <text x="40" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">25</text>
      </svg>
    ),
    'level-50': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 6L66 20V56L40 70L14 56V20L40 6Z" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
        <path d="M40 14L60 24V52L40 62L20 52V24L40 14Z" fill="currentColor" opacity="0.45" />
        <path d="M40 22L56 30V48L40 56L24 48V30L40 22Z" fill="currentColor" opacity="0.65" />
        <path d="M40 30L50 36V46L40 52L30 46V36L40 30Z" fill="currentColor" opacity="0.9" />
        <text x="40" y="46" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">50</text>
      </svg>
    ),
    'secret-explorer': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="2" opacity="0.3" />
        <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
        <text x="40" y="50" textAnchor="middle" fontSize="28" fontWeight="bold" fill="currentColor" opacity="0.9">?</text>
        <path d="M58 22L62 18M22 58L18 62M58 58L62 62M22 22L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
    'first-course-created': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="18" width="36" height="44" rx="3" stroke="currentColor" strokeWidth="2.5" opacity="0.4" />
        <path d="M22 30H44M22 38H44M22 46H38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <circle cx="58" cy="54" r="14" fill="currentColor" opacity="0.9" />
        <path d="M54 54H62M58 50V58" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    'first-lesson-created': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M48 14L64 30L30 64L14 66L16 50L48 14Z" fill="currentColor" opacity="0.75" />
        <path d="M44 18L60 34" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <circle cx="22" cy="58" r="4" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    'first-assessment-created': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="10" width="48" height="58" rx="4" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
        <rect x="26" y="18" width="28" height="8" rx="2" fill="currentColor" opacity="0.5" />
        <path d="M24 36H38M24 44H38M24 52H38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M44 34L48 38L56 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M44 42L48 46L56 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'first-learning-path-created': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="60" r="8" fill="currentColor" opacity="0.6" />
        <circle cx="40" cy="36" r="8" fill="currentColor" opacity="0.8" />
        <circle cx="64" cy="18" r="8" fill="currentColor" opacity="0.95" />
        <path d="M22 56L34 40M46 32L58 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" opacity="0.5" />
        <path d="M61 22L65 14L69 22H65V28H63V22H61Z" fill="currentColor" opacity="0.7" />
      </svg>
    ),
    'first-certificate-created': (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="18" width="60" height="40" rx="4" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
        <path d="M22 32H58M22 40H46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <circle cx="50" cy="52" r="12" fill="currentColor" opacity="0.9" />
        <path d="M45 52L49 56L56 48" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 62L50 68L58 62V74L50 70L42 74V62Z" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  }

  // Fallback generic icon
  const fallback = (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="3" opacity="0.3" />
      <path d="M40 18L44 30H56L46 38L50 50L40 42L30 50L34 38L24 30H36L40 18Z" fill="currentColor" opacity="0.9" />
    </svg>
  )

  return icons[slug] ?? fallback
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

function Confetti({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; delay: number; color: string }>
  >([])

  useEffect(() => {
    if (show) {
      const colors = [
        '#818cf8', '#a78bfa', '#c084fc', '#f472b6',
        '#fb923c', '#fbbf24', '#34d399',
      ]
      setParticles(
        Array.from({ length: 30 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        }))
      )
    }
  }, [show])

  if (!show) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${p.x}%`,
            top: '-8px',
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function BadgeModal({ badge, open, onClose }: BadgeModalProps) {
  const [animateIn, setAnimateIn] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (open && badge) {
      const t1 = setTimeout(() => setAnimateIn(true), 100)
      const t2 = setTimeout(() => setShowConfetti(true), 400)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    } else {
      setAnimateIn(false)
      setShowConfetti(false)
    }
  }, [open, badge])

  if (!badge) return null

  const badgeData = badge.badge ?? (badge as any)
  const slug: string = badgeData?.slug ?? ''
  const tier: string = badgeData?.tier ?? 'bronze'
  const config = getVisualConfig(slug, tier)
  const badgeName = slug ? t(`badges.${slug}.name`, { defaultValue: badgeData?.name }) : badgeData?.name
  const badgeDescription = slug ? t(`badges.${slug}.description`, { defaultValue: badgeData?.description }) : badgeData?.description

  const getAcademySlug = () => {
    const match = window.location.pathname.match(/\/academies\/([^/]+)/)
    return match ? match[1] : null
  }

  const handleViewAllBadges = () => {
    const academySlug = getAcademySlug()
    if (academySlug) navigate({ to: `/academies/${academySlug}/badges` })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          showCloseButton={false}
          className="bg-card/95 backdrop-blur-xl border-border/50 p-0 overflow-hidden max-w-md"
        >
          <DialogTitle className="sr-only">{badgeName}</DialogTitle>

          {/* Confetti */}
          <Confetti show={showConfetti} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 size-8 flex items-center justify-center rounded-full bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>

          {/* Glow background */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-30"
            style={{ backgroundColor: config.glowColor }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-8 pt-12 pb-8">
            {/* Badge icon */}
            <div
              className={cn(
                'relative transition-all duration-700 ease-out',
                animateIn ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              )}
            >
              {/* Animated rings */}
              <div
                className={cn(
                  'absolute inset-[-24px] rounded-full border-2 animate-ping opacity-20',
                  config.ringColor
                )}
                style={{ animationDuration: '2s' }}
              />
              <div
                className={cn(
                  'absolute inset-[-12px] rounded-full border animate-pulse opacity-30',
                  config.ringColor
                )}
              />

              {/* Badge container */}
              {badgeData?.icon_url ? (
                <div className={cn('relative size-32 rounded-full bg-gradient-to-br p-1', config.gradient)}>
                  <div className="size-full rounded-full bg-card flex items-center justify-center">
                    <img
                      src={badgeData.icon_url}
                      alt={badgeName}
                      className="size-20 object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className={cn('relative size-32 rounded-full bg-gradient-to-br p-1', config.gradient)}>
                  <div className="size-full rounded-full bg-card flex items-center justify-center">
                    <BadgeIcon slug={slug} className="size-20 text-primary" />
                  </div>
                </div>
              )}

              {/* Sparkles */}
              <Sparkles
                className={cn(
                  'absolute -top-2 -right-2 size-6 text-primary transition-all duration-500 delay-500',
                  animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                )}
              />
              <Sparkles
                className={cn(
                  'absolute -bottom-1 -left-3 size-4 text-primary/60 transition-all duration-500 delay-700',
                  animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                )}
              />
            </div>

            {/* Celebration text */}
            <div
              className={cn(
                'mt-8 flex flex-col items-center gap-2 transition-all duration-700 delay-200',
                animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                {t('gamification.badgeModal.newAchievement')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {badgeName}
              </h2>
            </div>

            {/* Description */}
            <p
              className={cn(
                'mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs transition-all duration-700 delay-300',
                animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              {badgeDescription}
            </p>

            {/* Points reward */}
            {badgeData?.points_reward > 0 && (
              <div
                className={cn(
                  'mt-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 transition-all duration-700 delay-400',
                  animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                <span className="text-sm text-primary font-medium">
                  {t('gamification.badgeModal.points', { count: badgeData.points_reward })}
                </span>
              </div>
            )}

            {/* Trigger context */}
            {badge.triggered_by && (
              <div
                className={cn(
                  'mt-3 text-xs text-muted-foreground transition-all duration-700 delay-400',
                  animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                {t('gamification.badgeModal.earnedBy')}{' '}
                <span className="font-medium text-foreground">{badge.triggered_by.name}</span>
              </div>
            )}

            {/* Actions */}
            <div
              className={cn(
                'mt-8 flex flex-col sm:flex-row items-center gap-3 w-full transition-all duration-700 delay-500',
                animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <Button
                onClick={handleViewAllBadges}
                className="w-full sm:flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                {t('gamification.badgeModal.viewBadges')}
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto h-11 gap-2 border-border/60 hover:bg-secondary/50 transition-colors"
                onClick={onClose}
              >
                <Share2 className="size-4" />
                {t('gamification.badgeModal.share')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 2.5s ease-out forwards;
        }
      `}</style>
    </>
  )
}
