import { app } from './app.js'
import { env } from '@/env/index.js'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running 🚀')
    console.log('Server running at http://localhost:3333')
    console.log('📚 Reach docs at http://localhost:3333/docs')
  })
