import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { Particles } from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { Engine } from 'tsparticles-engine'
import apiClient from '@/lib/api'

export function LoginPage() {
  const [email, setEmail] = useState('') // Changed from email to username
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, setUser, setRefresh, setAccess } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await apiClient.post('auth/jwt/create/', {
        email,
        password,
      });

      const { refresh, access } = response.data;

      if (refresh && access) {
        setRefresh(refresh);
        setAccess(access);

        // after successful login, we pull user profile data from the server
        const profileResponse = await apiClient.get('users/profiles/me/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        const { id, accounts, name, user } = profileResponse.data;
        if (id && accounts && name && user) {
            setUser(user);
            // redirect to dashboard
            window.location.href = '/dashboard';
        }

      } else {
        alert('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error)
      alert('Invalid username or password');
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
      return <Navigate to="/dashboard" replace />
  }

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div id="tsparticles" className="absolute inset-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "hsl(var(--background))",
              },
            },
            fpsLimit: 60,
            particles: {
              color: {
                value: "hsl(var(--primary))",
              },
              links: {
                color: "hsl(var(--primary))",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.8,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>
      
      <div className="relative flex flex-col md:flex-row min-h-screen">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 lg:w-[600px] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '80%' }}
          >
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border border-border">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-center mb-4">
                  <img src="/logo.png" alt="GeoSat Logo" className="h-12" />
                </div>
                <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">Sign in to continue to Nexus-Link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Social Login */}
                <div className="space-y-3">
                  <Button 
                    variant="secondary" 
                    className="w-full flex items-center justify-center space-x-2"
                    disabled={isLoading}
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                    <span>Continue with Google</span>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-card/80"
                        disabled={isLoading}
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-card/80"
                        disabled={isLoading}
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="inline-flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right side - Illustration */}
        <motion.div 
          className="flex-1 relative overflow-hidden h-64 md:h-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://res.cloudinary.com/tracking/image/upload/v1572254303/backgroundImages/road-3133502_1920_ar2wi9.jpg"
            alt="Vehicle Tracking Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/40" /> {/* Dark overlay */}
          <motion.div 
            className="relative h-full flex items-center justify-center p-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card/10 backdrop-blur-md rounded-xl p-8 max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground/80 mb-4">Real-time Vehicle Tracking</h2>
              <p className="text-foreground/80 text-lg">
                Track your fleet in real-time, optimize routes, and improve efficiency with our advanced GPS tracking system.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}