import { serve } from '@hono/node-server';
import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono()

app.use(
    '*',
    cors({
        origin: process.env.ALLOWED_API_ORIGINS?.split(",") ?? [],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        
    })
)

app.get('/', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!'
  })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
