export default function WelcomePage() {
<<<<<<< Updated upstream
  return null
=======
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    router.push('/intro/1')
  }

  const handleLogin = () => {
    setIsLoading(true)
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Image Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[60%] w-full overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1581092163320-8ef59ddb8107?w=600&h=400&fit=crop"
          alt="Egyptian urban neighborhood"
          className="h-full w-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex-1 px-4 flex flex-col items-center justify-center text-center gap-6 pb-8"
      >
        <div>
          <h2 className="text-4xl font-bold text-iron-600 font-cairo mb-2">
            حِرفي موثوق لكل بيت
          </h2>
          <p className="text-base text-on-surface-variant font-cairo max-w-sm mx-auto">
            نصلك بأفضل الحرفيين المعتمدين في منطقتك بضغطة زر واحدة.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="w-full space-y-3 max-w-xs">
          <Button
            onClick={handleGetStarted}
            disabled={isLoading}
            className="w-full h-12 bg-iron-600 text-white font-cairo font-semibold text-base rounded-lg hover:bg-iron-700"
          >
            {isLoading ? 'جاري...' : 'ابدأ الآن'}
          </Button>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 border-2 border-iron-600 text-iron-600 font-cairo font-semibold text-base rounded-lg hover:bg-iron-50"
          >
            تسجيل الدخول
          </Button>
        </div>

        <p className="text-xs text-muted-foreground font-cairo mt-2">
          باستمرارك، أنت توافق على <span className="text-iron-600 cursor-pointer">شروطنا</span>
        </p>
      </motion.div>
    </div>
  )
>>>>>>> Stashed changes
}
