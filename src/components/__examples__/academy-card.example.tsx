import { AcademyCard, type AcademyMembership } from '../academy-card'

// Example academy data for demonstration
const exampleAcademies: AcademyMembership[] = [
  {
    id: 1,
    name: 'Technology Academy',
    description: 'Learn cutting-edge technology skills including web development, mobile apps, AI, and cloud computing. Perfect for advancing your tech career.',
    logo_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=center',
    user_role: 'admin',
    user_role_display: 'Administrator',
    created_at: '2024-01-01T00:00:00Z',
    last_accessed: '2024-02-09T10:30:00Z'
  },
  {
    id: 2,
    name: 'Art & Design Academy',
    description: 'Explore your creative side with courses in digital art, graphic design, photography, and visual storytelling.',
    logo_url: null,
    user_role: 'student',
    user_role_display: 'Student',
    created_at: '2024-01-15T00:00:00Z',
    last_accessed: '2024-02-08T14:20:00Z'
  },
  {
    id: 3,
    name: 'Business Leadership Institute',
    description: 'Develop essential leadership and management skills for the modern workplace.',
    logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center',
    user_role: 'teacher',
    user_role_display: 'Teacher',
    created_at: '2024-02-01T00:00:00Z',
    last_accessed: null
  },
  {
    id: 4,
    name: 'Health & Wellness Academy',
    description: '',
    logo_url: null,
    user_role: 'moderator',
    user_role_display: 'Moderator',
    created_at: '2024-01-20T00:00:00Z',
    last_accessed: '2024-01-25T09:15:00Z'
  }
]

export function AcademyCardExamples() {
  const handleAcademySelect = (academy: AcademyMembership) => {
    console.log('Selected academy:', academy)
    alert(`Selected: ${academy.name} (${academy.user_role_display})`)
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Academy Card Examples</h1>
        <p className="text-muted-foreground mb-8">
          Interactive examples of the Academy Card component with different states and data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleAcademies.map((academy) => (
            <AcademyCard
              key={academy.id}
              academy={academy}
              onSelect={handleAcademySelect}
            />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Component Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium">Visual Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Academy logo with fallback icon</li>
                <li>Role badge with proper styling</li>
                <li>Hover effects and animations</li>
                <li>Responsive design</li>
                <li>Content truncation for long text</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Interaction Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Click to select academy</li>
                <li>Keyboard navigation (Enter/Space)</li>
                <li>Focus management</li>
                <li>Accessibility attributes</li>
                <li>Error handling for images</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}