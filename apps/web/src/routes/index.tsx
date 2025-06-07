import { TestComponent } from '@repo/ui/test';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="p-2 p-12">
      <h3>Welcome Home!</h3>
      <TestComponent />
    </div>
  );
}
