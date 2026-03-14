import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  Building2,
  CreditCard,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MessageCircle,
  PlayCircle,
  Rocket,
  Settings,
  Shield,
  User,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

const categories = [
  {
    titleKey: 'helpCenter.categories.gettingStarted.title',
    descriptionKey: 'helpCenter.categories.gettingStarted.description',
    icon: Rocket,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    links: [
      {
        labelKey: 'helpCenter.categories.gettingStarted.links.dashboard',
        to: '/dashboard',
      },
      {
        labelKey: 'helpCenter.categories.gettingStarted.links.onboarding',
        to: '/onboarding',
      },
      {
        labelKey: 'helpCenter.categories.gettingStarted.links.exploreCourses',
        to: '/courses',
      },
      {
        labelKey: 'helpCenter.categories.gettingStarted.links.exploreAcademies',
        to: '/academies',
      },
    ],
  },
  {
    titleKey: 'helpCenter.categories.academy.title',
    descriptionKey: 'helpCenter.categories.academy.description',
    icon: Building2,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    links: [
      {
        labelKey: 'helpCenter.categories.academy.links.createAcademy',
        to: '/academy/create',
      },
      {
        labelKey: 'helpCenter.categories.academy.links.manageAcademy',
        to: '/dashboard',
      },
      {
        labelKey: 'helpCenter.categories.academy.links.academyMembers',
        to: '/dashboard',
      },
    ],
  },
  {
    titleKey: 'helpCenter.categories.courses.title',
    descriptionKey: 'helpCenter.categories.courses.description',
    icon: PlayCircle,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    links: [
      {
        labelKey: 'helpCenter.categories.courses.links.browseCourses',
        to: '/courses',
      },
      {
        labelKey: 'helpCenter.categories.courses.links.myCourses',
        to: '/my-courses',
      },
      {
        labelKey: 'helpCenter.categories.courses.links.certificates',
        to: '/my-courses',
      },
    ],
  },
  {
    titleKey: 'helpCenter.categories.account.title',
    descriptionKey: 'helpCenter.categories.account.description',
    icon: User,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    links: [
      {
        labelKey: 'helpCenter.categories.account.links.profile',
        to: '/settings/profile',
      },
      {
        labelKey: 'helpCenter.categories.account.links.account',
        to: '/settings/account',
      },
      {
        labelKey: 'helpCenter.categories.account.links.appearance',
        to: '/settings/appearance',
      },
      {
        labelKey: 'helpCenter.categories.account.links.notifications',
        to: '/settings/notifications',
      },
    ],
  },
  {
    titleKey: 'helpCenter.categories.billing.title',
    descriptionKey: 'helpCenter.categories.billing.description',
    icon: CreditCard,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    links: [
      {
        labelKey: 'helpCenter.categories.billing.links.purchaseCourse',
        to: '/courses',
      },
      {
        labelKey: 'helpCenter.categories.billing.links.accessCode',
        to: '/redeem-access-code',
      },
      {
        labelKey: 'helpCenter.categories.billing.links.refunds',
        to: '/dashboard',
      },
    ],
  },
  {
    titleKey: 'helpCenter.categories.security.title',
    descriptionKey: 'helpCenter.categories.security.description',
    icon: Shield,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    links: [
      {
        labelKey: 'helpCenter.categories.security.links.privacy',
        to: '/privacy',
      },
      { labelKey: 'helpCenter.categories.security.links.terms', to: '/terms' },
      {
        labelKey: 'helpCenter.categories.security.links.settings',
        to: '/settings/account',
      },
    ],
  },
]

const faqs = [
  {
    qKey: 'helpCenter.faq.items.howToCreate.q',
    aKey: 'helpCenter.faq.items.howToCreate.a',
  },
  {
    qKey: 'helpCenter.faq.items.howToEnroll.q',
    aKey: 'helpCenter.faq.items.howToEnroll.a',
  },
  {
    qKey: 'helpCenter.faq.items.certificate.q',
    aKey: 'helpCenter.faq.items.certificate.a',
  },
  {
    qKey: 'helpCenter.faq.items.refund.q',
    aKey: 'helpCenter.faq.items.refund.a',
  },
  {
    qKey: 'helpCenter.faq.items.multipleAcademies.q',
    aKey: 'helpCenter.faq.items.multipleAcademies.a',
  },
]

export function HelpCenterPage() {
  const { t } = useTranslation()
  const { user: currentUser, currentAcademy } = useAuthStore()

  return (
    <DashboardLayout
      user={currentUser}
      academy={currentAcademy}
      variant='full'
      title={t('helpCenter.title')}
      subtitle={t('helpCenter.subtitle')}
    >
      <div className='space-y-8'>
        {/* Hero */}
        <div className='from-primary/5 to-primary/10 rounded-xl bg-gradient-to-br p-8 text-center'>
          <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
            <HelpCircle className='text-primary h-8 w-8' />
          </div>
          <h1 className='text-3xl font-bold'>{t('helpCenter.hero.title')}</h1>
          <p className='text-muted-foreground mt-2 text-lg'>
            {t('helpCenter.hero.subtitle')}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <div className='mb-4 flex items-center gap-2'>
            <LayoutDashboard className='text-primary h-5 w-5' />
            <h2 className='text-xl font-semibold'>
              {t('helpCenter.quickLinks.title')}
            </h2>
          </div>
          <div className='flex flex-wrap gap-2'>
            {[
              { label: t('navigation.dashboard'), to: '/dashboard' },
              { label: t('navigation.courses'), to: '/courses' },
              { label: t('navigation.settings'), to: '/settings/profile' },
              { label: t('navigation.createAcademy'), to: '/academy/create' },
              { label: t('navigation.exploreAcademies'), to: '/academies' },
            ].map((link) => (
              <Button key={link.to} variant='outline' size='sm' asChild>
                <Link to={link.to}>
                  {link.label}
                  <ChevronRight className='ml-1 h-3 w-3' />
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <div className='mb-4 flex items-center gap-2'>
            <BookOpen className='text-primary h-5 w-5' />
            <h2 className='text-xl font-semibold'>
              {t('helpCenter.categories.title')}
            </h2>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Card
                  key={cat.titleKey}
                  className='transition-shadow hover:shadow-md'
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.bg}`}
                      >
                        <Icon className={`h-5 w-5 ${cat.color}`} />
                      </div>
                      <div>
                        <CardTitle className='text-base'>
                          {t(cat.titleKey)}
                        </CardTitle>
                        <CardDescription className='text-xs'>
                          {t(cat.descriptionKey)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    <ul className='space-y-1'>
                      {cat.links.map((link) => (
                        <li key={link.labelKey}>
                          <Link
                            to={link.to}
                            className='text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors'
                          >
                            <ChevronRight className='h-3 w-3 flex-shrink-0' />
                            {t(link.labelKey)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* FAQ */}
        <div>
          <div className='mb-4 flex items-center gap-2'>
            <MessageCircle className='text-primary h-5 w-5' />
            <h2 className='text-xl font-semibold'>
              {t('helpCenter.faq.title')}
            </h2>
            <Badge variant='secondary'>{faqs.length}</Badge>
          </div>
          <div className='space-y-3'>
            {faqs.map((faq, i) => (
              <Card key={i}>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-base font-medium'>
                    {t(faq.qKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground text-sm'>{t(faq.aKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Contact Support */}
        <div className='grid gap-4 sm:grid-cols-2'>
          <Card className='border-primary/20 bg-primary/5'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Mail className='text-primary h-5 w-5' />
                </div>
                <div>
                  <CardTitle className='text-base'>
                    {t('helpCenter.contact.email.title')}
                  </CardTitle>
                  <CardDescription className='text-xs'>
                    {t('helpCenter.contact.email.description')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant='outline' size='sm' asChild>
                <a
                  href='mailto:support@iswoacademy.com'
                  className='flex items-center gap-1'
                >
                  support@iswoacademy.com
                  <ExternalLink className='h-3 w-3' />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-lg'>
                  <GraduationCap className='text-muted-foreground h-5 w-5' />
                </div>
                <div>
                  <CardTitle className='text-base'>
                    {t('helpCenter.contact.docs.title')}
                  </CardTitle>
                  <CardDescription className='text-xs'>
                    {t('helpCenter.contact.docs.description')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                <Button variant='outline' size='sm' asChild>
                  <Link to='/privacy'>
                    <Settings className='mr-1 h-3 w-3' />
                    {t('landing.footer.privacy')}
                  </Link>
                </Button>
                <Button variant='outline' size='sm' asChild>
                  <Link to='/terms'>
                    <BookOpen className='mr-1 h-3 w-3' />
                    {t('helpCenter.contact.docs.termsLink')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
