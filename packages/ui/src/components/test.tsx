import { useState } from 'react';

interface TestComponentProps {
    initialCount?: number;
}

export const TestComponent = ({ initialCount = 0 }: TestComponentProps) => {
    const [count, setCount] = useState(initialCount);

    return (
        <div className="p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4">Test Component</h2>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setCount(count - 1)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Decrease
                </button>
                <span className="text-2xl font-bold">{count}</span>
                <button
                    onClick={() => setCount(count + 1)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Increase
                </button>
            </div>
        </div>
    );
};
