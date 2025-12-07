import { Link } from '@tanstack/react-router'
import { BookmarkIcon, HeartIcon, GraduationCapIcon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PointsDisplay } from '@/components/gamification/points-display'
import { NotificationDropdown } from '@/components/notifications'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

export function Dashboard() {
  const { user, academyData } = useAuthStore()
  const isGuestUser = !academyData || academyData.count === 0

  // Guest User Dashboard (no academies)
  if (isGuestUser) {
    return (
      <>
        {/* ===== Top Heading ===== */}
        <Header>
          <TopNav links={topNav} />
          <div className='ms-auto flex items-center space-x-4'>
            <Search />
            <PointsDisplay compact />
            <NotificationDropdown />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        {/* ===== Main ===== */}
        <Main>
          <div className='mb-6 space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight'>
              ¡Bienvenido, {user?.first_name}! 👋
            </h1>
            <p className='text-muted-foreground text-lg'>
              Explora cursos, guarda tus favoritos y comienza tu viaje de
              aprendizaje
            </p>
          </div>

          {/* Quick Actions */}
          <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <Card className='transition-shadow hover:shadow-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Cursos Favoritos
                </CardTitle>
                <HeartIcon className='text-muted-foreground h-5 w-5' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>0</div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Cursos que te interesan
                </p>
                <Button variant='link' className='mt-2 px-0' asChild>
                  <Link to='/courses'>Ver todos los cursos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className='transition-shadow hover:shadow-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Guardados</CardTitle>
                <BookmarkIcon className='text-muted-foreground h-5 w-5' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>0</div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Para ver más tarde
                </p>
                <Button variant='link' className='mt-2 px-0' asChild>
                  <Link to='/courses'>Explorar cursos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className='transition-shadow hover:shadow-lg'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Crear Academia
                </CardTitle>
                <GraduationCapIcon className='text-muted-foreground h-5 w-5' />
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground mt-1 text-sm'>
                  ¿Quieres crear tu propia academia?
                </p>
                <Button className='mt-3 w-full'>Crear Academia</Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <Tabs defaultValue='recommended' className='space-y-4'>
            <TabsList>
              <TabsTrigger value='recommended'>Recomendados</TabsTrigger>
              <TabsTrigger value='favorites'>Mis Favoritos</TabsTrigger>
              <TabsTrigger value='saved'>Guardados</TabsTrigger>
            </TabsList>

            <TabsContent value='recommended' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Cursos Recomendados</CardTitle>
                  <CardDescription>
                    Cursos populares que podrían interesarte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='py-12 text-center'>
                    <GraduationCapIcon className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                    <p className='text-muted-foreground'>
                      Estamos cargando cursos recomendados para ti...
                    </p>
                    <Button className='mt-4' asChild>
                      <Link to='/courses'>Explorar todos los cursos</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='favorites' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Mis Cursos Favoritos</CardTitle>
                  <CardDescription>
                    Cursos que has marcado como favoritos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='py-12 text-center'>
                    <HeartIcon className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                    <p className='text-muted-foreground mb-2'>
                      Aún no tienes cursos favoritos
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      Explora cursos y márcalos como favoritos para verlos aquí
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='saved' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Cursos Guardados</CardTitle>
                  <CardDescription>
                    Cursos que guardaste para ver más tarde
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='py-12 text-center'>
                    <BookmarkIcon className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                    <p className='text-muted-foreground mb-2'>
                      No has guardado ningún curso aún
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      Guarda cursos interesantes para revisarlos después
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Main>
      </>
    )
  }

  // Regular Dashboard (with academies)
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <PointsDisplay compact />
          <NotificationDropdown />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics' disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$45,231.89</div>
                  <p className='text-muted-foreground text-xs'>
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+2350</div>
                  <p className='text-muted-foreground text-xs'>
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+12,234</div>
                  <p className='text-muted-foreground text-xs'>
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Active Now
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+573</div>
                  <p className='text-muted-foreground text-xs'>
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
