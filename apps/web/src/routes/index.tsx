import { Input } from '@repo/ui/components/input';
import { TestComponent } from '@repo/ui/test';
import { Button } from '@repo/ui/ui/button';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
  loader: async () => {
    const res = await fetch('http://localhost:3000');
    return res.json() as Promise<{ ok: boolean; message: string }>;
  },
});

function Index() {
  const data = Route.useLoaderData();

  return (
    <div className="p-2 p-12">
      <h3>Welcome Home!</h3>
      <p>{data?.message}</p>
      <TestComponent />
      <Button>Click me</Button>
      <Input />
    </div>
  );
}
