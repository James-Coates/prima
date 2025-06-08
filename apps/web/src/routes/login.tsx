import * as React from 'react';
import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';

import { useAuth } from '../utils/auth';
import z from 'zod/v4';
import { Input } from '@repo/ui/components/input';
import { LoadingSpinner } from '../components/LoadingSpinner';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = '/dashboard' as const;

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isLoading) {
      return;
    }
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginComponent,
  pendingComponent: LoadingSpinner,
});

function LoginComponent() {
  const auth = useAuth();
  const router = useRouter();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const navigate = Route.useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const search = Route.useSearch();

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    try {
      evt.preventDefault();
      const data = new FormData(evt.currentTarget);
      const emailValue = data.get('email');
      const passwordValue = data.get('password');
      if (!emailValue || !passwordValue) return;
      const email = emailValue.toString();
      const password = passwordValue.toString();

      await auth.login(email, password);

      await router.invalidate();

      await navigate({ to: search.redirect || fallback });
    } catch (error) {
      console.error('Error logging in: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoggingIn = isLoading || isSubmitting;

  return (
    <div className="p-2 grid gap-2 place-items-center">
      <h3 className="text-xl">Login page</h3>
      {search.redirect ? (
        <p className="text-red-500">You need to login to access this page.</p>
      ) : (
        <p>Login to see all the cool content in here.</p>
      )}
      <form className="mt-4 max-w-lg" onSubmit={onFormSubmit}>
        <fieldset disabled={isLoggingIn} className="w-full grid gap-2">
          <div className="grid gap-2 items-center min-w-[300px]">
            <label htmlFor="email-input" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email-input"
              name="email"
              placeholder="Enter your email"
              type="text"
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <div className="grid gap-2 items-center min-w-[300px]">
            <label htmlFor="password-input" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password-input"
              name="password"
              placeholder="Enter your password"
              type="password"
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isLoggingIn ? 'Loading...' : 'Login'}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
