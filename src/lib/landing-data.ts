/**
 * Static mock data for landing pages.
 * Used by pages not yet migrated to the live API.
 * Once a page is migrated, remove its data from here.
 */
import type {
  LandingAcademy,
  LandingCategory,
  LandingCourse,
} from '@/types/pages/home'

export type { LandingAcademy, LandingCategory, LandingCourse }

// ---------------------------------------------------------------------------
// Featured categories (used by academies-landing page)
// ---------------------------------------------------------------------------
export const featuredCategories: LandingCategory[] = [
  {
    id: 'desarrollo-web',
    name: 'Desarrollo Web',
    tagline: 'Domina el stack moderno',
    description:
      'Aprende React, Node.js, TypeScript y todo lo que necesitas para construir aplicaciones web profesionales.',
    icon: 'Globe',
    accentFrom: 'from-blue-500',
    accentTo: 'to-cyan-400',
    academies: [
      {
        id: 'a1',
        name: 'Academia Full Stack Pro',
        description:
          'De cero a desarrollador full stack con los frameworks más demandados del mercado.',
        coursesCount: 18,
        studentsCount: 8400,
        rating: 4.9,
        instructor: 'Carlos Mendoza',
      },
      {
        id: 'a2',
        name: 'React & Next.js Mastery',
        description:
          'Domina el ecosistema React con proyectos reales y buenas prácticas de la industria.',
        coursesCount: 12,
        studentsCount: 5200,
        rating: 4.8,
        instructor: 'Ana Torres',
      },
      {
        id: 'a3',
        name: 'Backend Node.js',
        description:
          'APIs REST, GraphQL, microservicios y arquitecturas escalables con Node.js.',
        coursesCount: 9,
        studentsCount: 3100,
        rating: 4.7,
        instructor: 'Miguel Ángel Ruiz',
      },
    ],
  },
  {
    id: 'diseno',
    name: 'Diseño',
    tagline: 'Crea experiencias visuales',
    description:
      'UI/UX, Figma, diseño de sistemas y todo lo que necesitas para crear interfaces que enamoran.',
    icon: 'Palette',
    accentFrom: 'from-pink-500',
    accentTo: 'to-rose-400',
    academies: [
      {
        id: 'b1',
        name: 'UI/UX Design Pro',
        description:
          'Diseño centrado en el usuario: investigación, wireframes, prototipos y sistemas de diseño.',
        coursesCount: 14,
        studentsCount: 6300,
        rating: 4.9,
        instructor: 'Sofía Ramírez',
      },
      {
        id: 'b2',
        name: 'Figma & Design Systems',
        description:
          'Crea y mantiene sistemas de diseño escalables con Figma y componentes reutilizables.',
        coursesCount: 8,
        studentsCount: 4100,
        rating: 4.8,
        instructor: 'Diego Fernández',
      },
      {
        id: 'b3',
        name: 'Motion & Branding',
        description:
          'Animaciones, identidad de marca y diseño gráfico para productos digitales.',
        coursesCount: 7,
        studentsCount: 2800,
        rating: 4.7,
        instructor: 'Valeria Cruz',
      },
    ],
  },
  {
    id: 'inteligencia-artificial',
    name: 'Inteligencia Artificial',
    tagline: 'Construye el futuro con IA',
    description:
      'Machine learning, deep learning, LLMs y aplicaciones de IA que transforman industrias.',
    icon: 'Brain',
    accentFrom: 'from-violet-500',
    accentTo: 'to-purple-400',
    academies: [
      {
        id: 'c1',
        name: 'Machine Learning Academy',
        description:
          'Fundamentos y aplicaciones de ML con Python, scikit-learn y TensorFlow.',
        coursesCount: 16,
        studentsCount: 9200,
        rating: 4.9,
        instructor: 'Roberto Silva',
      },
      {
        id: 'c2',
        name: 'LLMs & Prompt Engineering',
        description:
          'Construye aplicaciones con GPT, Claude y modelos open source. Prompt engineering avanzado.',
        coursesCount: 11,
        studentsCount: 7800,
        rating: 4.8,
        instructor: 'Laura Gómez',
      },
      {
        id: 'c3',
        name: 'Computer Vision Pro',
        description:
          'Detección de objetos, segmentación y visión computacional con PyTorch.',
        coursesCount: 10,
        studentsCount: 4500,
        rating: 4.7,
        instructor: 'Andrés Martínez',
      },
    ],
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    tagline: 'Escala sin límites',
    description:
      'AWS, GCP, Azure, Kubernetes, CI/CD y todo lo necesario para infraestructuras modernas.',
    icon: 'Cloud',
    accentFrom: 'from-sky-500',
    accentTo: 'to-blue-400',
    academies: [
      {
        id: 'd1',
        name: 'AWS Solutions Architect',
        description:
          'Diseña y despliega arquitecturas cloud en AWS. Preparación para certificaciones.',
        coursesCount: 15,
        studentsCount: 7100,
        rating: 4.8,
        instructor: 'Patricia Vega',
      },
      {
        id: 'd2',
        name: 'Kubernetes & Docker',
        description:
          'Contenedores, orquestación y despliegues productivos con K8s y Docker.',
        coursesCount: 9,
        studentsCount: 5600,
        rating: 4.7,
        instructor: 'Fernando López',
      },
      {
        id: 'd3',
        name: 'DevOps & CI/CD',
        description:
          'GitHub Actions, pipelines, GitOps y cultura DevOps para equipos ágiles.',
        coursesCount: 7,
        studentsCount: 3900,
        rating: 4.6,
        instructor: 'Isabel Morales',
      },
    ],
  },
  {
    id: 'ciberseguridad',
    name: 'Ciberseguridad',
    tagline: 'Protege lo que importa',
    description:
      'Ethical hacking, pentesting, seguridad ofensiva y defensiva para entornos reales.',
    icon: 'Shield',
    accentFrom: 'from-emerald-500',
    accentTo: 'to-teal-400',
    academies: [
      {
        id: 'e1',
        name: 'Ethical Hacking Pro',
        description:
          'Pentesting, vulnerabilidades y hacking ético con metodologías reales de la industria.',
        coursesCount: 13,
        studentsCount: 6800,
        rating: 4.9,
        instructor: 'Marcos Herrera',
      },
      {
        id: 'e2',
        name: 'Blue Team & Defensa',
        description:
          'SOC, SIEM, respuesta a incidentes y seguridad defensiva para organizaciones.',
        coursesCount: 10,
        studentsCount: 4200,
        rating: 4.8,
        instructor: 'Elena Castillo',
      },
      {
        id: 'e3',
        name: 'Bug Bounty Academy',
        description:
          'Encuentra vulnerabilidades y gana recompensas. Métodos reales de bug bounty hunters.',
        coursesCount: 8,
        studentsCount: 3500,
        rating: 4.7,
        instructor: 'Pablo Núñez',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Mock courses (used by courses-section on the home page)
// ---------------------------------------------------------------------------
export const mockLandingCourses: LandingCourse[] = [
  {
    id: 'co1',
    title: 'React 19 & Next.js 15: Aplicaciones Full Stack',
    description:
      'Construye aplicaciones completas con las últimas versiones de React y Next.js, incluyendo Server Components y Server Actions.',
    instructor: 'Carlos Mendoza',
    category: 'Desarrollo Web',
    duration: '42h',
    totalLessons: 156,
    rating: 4.9,
    students: 12400,
    price: '$49',
  },
  {
    id: 'co2',
    title: 'Python para Machine Learning desde Cero',
    description:
      'Aprende Python aplicado a ciencia de datos: numpy, pandas, scikit-learn y tus primeros modelos predictivos.',
    instructor: 'Roberto Silva',
    category: 'Inteligencia Artificial',
    duration: '38h',
    totalLessons: 134,
    rating: 4.8,
    students: 9800,
    price: '$39',
  },
  {
    id: 'co3',
    title: 'UI/UX Design: De Wireframe a Producto',
    description:
      'Todo el proceso de diseño centrado en el usuario desde la investigación hasta la entrega al desarrollo.',
    instructor: 'Sofía Ramírez',
    category: 'Diseno',
    duration: '28h',
    totalLessons: 98,
    rating: 4.9,
    students: 7200,
    price: '$44',
  },
  {
    id: 'co4',
    title: 'AWS Certified Solutions Architect Associate',
    description:
      'Prepárate para la certificación SAA-C03 con laboratorios prácticos en AWS y simulacros de examen.',
    instructor: 'Patricia Vega',
    category: 'Cloud',
    duration: '35h',
    totalLessons: 120,
    rating: 4.8,
    students: 6500,
    price: '$54',
  },
  {
    id: 'co5',
    title: 'Node.js Microservicios y APIs REST',
    description:
      'Arquitectura de microservicios con Node.js, Express, Docker y comunicación entre servicios.',
    instructor: 'Miguel Ángel Ruiz',
    category: 'Backend',
    duration: '32h',
    totalLessons: 112,
    rating: 4.7,
    students: 5800,
    price: '$42',
  },
  {
    id: 'co6',
    title: 'Ethical Hacking: Pentesting Profesional',
    description:
      'Metodologías de hacking ético, explotación de vulnerabilidades y reporte de hallazgos como un profesional.',
    instructor: 'Marcos Herrera',
    category: 'Seguridad',
    duration: '45h',
    totalLessons: 168,
    rating: 4.9,
    students: 8100,
    price: '$59',
  },
  {
    id: 'co7',
    title: 'Flutter & Dart: Apps Móviles Multiplataforma',
    description:
      'Desarrolla aplicaciones nativas para iOS y Android con Flutter desde cero hasta publicación.',
    instructor: 'Ana Torres',
    category: 'Mobile',
    duration: '36h',
    totalLessons: 128,
    rating: 4.8,
    students: 4900,
    price: '$46',
  },
  {
    id: 'co8',
    title: 'Figma Avanzado y Design Systems',
    description:
      'Crea sistemas de diseño escalables, componentes avanzados y flujos de trabajo colaborativos en Figma.',
    instructor: 'Diego Fernández',
    category: 'Diseno',
    duration: '22h',
    totalLessons: 84,
    rating: 4.8,
    students: 5600,
    price: '$36',
  },
]
