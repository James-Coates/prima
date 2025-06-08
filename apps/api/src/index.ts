import { serve } from '@hono/node-server';
import 'dotenv/config';
import { Hono, type MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';
import { db } from './db/index.js';
import { auth } from './auth/index.js';
import { createMiddleware } from 'hono/factory';
import type { Session, User } from './db/schema.js';

interface Context {
  Variables: {
    user: User | null;
    session: Session | null;
  };
}

const app = new Hono<Context>();

app.use(
  '*',
  cors({
    origin: process.env.ALLOWED_API_ORIGINS?.split(',') ?? [],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

// middleware to check if the user is authenticated
app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  c.set('user', session.user as User);
  c.set('session', session.session as Session);
  return next();
});

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

app.get('/', async (c) => {
  const test = await db.query.user.findMany();

  return c.json({
    ok: true,
    message: 'Hello Hono!',
    users: test,
  });
});

app.get('/auth/session', (c) => {
  const session = c.get('session');
  const user = c.get('user');

  // if (!user) return c.body(null, 401);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  return c.json({
    session,
    user,
  });
});

app.post('/auth/signup', async (c) => {
  const { email, password } = await c.req.json();
  const x = await auth.api.signUpEmail({
    body: {
      name: '',
      email,
      password,
    },
  });

  console.log('Response headers:', c.res.headers);

  return c.json(x);
});

app.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json();

  const authResponse = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
  });

  return authResponse;
});

app.post('/auth/logout', async (c) => {
  await auth.api.signOut({ headers: c.req.raw.headers });
  return c.json({ message: 'Logged out' });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
