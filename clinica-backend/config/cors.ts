import { defineConfig } from '@adonisjs/cors'

const corsConfig = defineConfig({
  enabled: true,
  origin: 'http://localhost:4200', // Tu puerto de Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  headers: [
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Requested-With',
  ],
  exposeHeaders: [],
  credentials: true, // ESTO TIENE QUE SER TRUE SÍ O SÍ
  maxAge: 90,
})

export default corsConfig