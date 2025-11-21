import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { CheckCircle2, Mail, Sparkles, ArrowRight, BookOpen, Trophy, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomButton } from '@/components/ui/custom-button'
import { AnimatedAuthLayout } from '../components/animated-auth-layout'

export function SignUpSuccess() {
  return (
    <AnimatedAuthLayout
      title="¡Bienvenido a ISWO Academy!"
      subtitle="Tu cuenta ha sido creada exitosamente. Prepárate para una experiencia de aprendizaje extraordinaria."
      showBackButton={false}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        {/* Sparkles animados */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [-10, 10, -10],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -top-6 -left-6 text-yellow-400"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [-5, 15, -5],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -top-4 -right-8 text-purple-400"
        >
          <Star className="w-6 h-6" />
        </motion.div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-blue-50/30 to-purple-50/50" />
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>

              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                ¡Registro Exitoso!
              </CardTitle>
              
              <CardDescription className="text-lg text-gray-600 mt-2 leading-relaxed">
                Tu cuenta ha sido creada exitosamente. <br />
                Hemos enviado un correo de confirmación a tu bandeja de entrada.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 flex items-center gap-4"
              >
                <Mail className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900">Verifica tu correo</h4>
                  <p className="text-sm text-blue-700">Revisa tu bandeja de entrada y haz clic en el enlace de confirmación.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="space-y-3"
              >
                <h4 className="font-semibold text-gray-900 text-center mb-4">Lo que te espera en ISWO Academy:</h4>
                
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>Acceso a cursos interactivos y contenido exclusivo</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span>Sistema de logros y certificaciones</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Star className="w-5 h-5 text-purple-600" />
                  <span>Comunidad de aprendizaje colaborativo</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                className="space-y-3 pt-4"
              >
                <CustomButton asChild variant="primary" className="w-full group">
                  <Link to="/sign-in">
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CustomButton>
                
                <CustomButton asChild variant="primary" className="w-full">
                  <Link to="/sign-up">Registrar Otra Cuenta</Link>
                </CustomButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.3 }}
                className="text-center pt-4 border-t border-gray-100"
              >
                <p className="text-xs text-gray-500">
                  💡 <strong>Dato curioso:</strong> Los usuarios verificados tienen acceso a contenido premium desde el primer día.
                </p>
              </motion.div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatedAuthLayout>
  )
}
