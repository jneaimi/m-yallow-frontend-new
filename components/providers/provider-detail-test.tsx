'use client';

import { useProvider } from '@/hooks/providers/use-provider';
import { Loader2 } from 'lucide-react';

interface ProviderDetailTestProps {
  providerId: string;
}

export function ProviderDetailTest({ providerId }: ProviderDetailTestProps) {
  const { data: provider, isLoading, error } = useProvider(providerId);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p>Loading provider {providerId}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="p-6 text-center">
        <p>Provider not found</p>
      </div>
    );
  }

  // Basic display of provider data for testing purposes
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">{provider.name}</h2>
      <p className="text-sm text-gray-500 mb-4">ID: {provider.id}</p>
      {provider.about && <p className="mb-2">{provider.about}</p>}
      {provider.contact && (
        <p className="mb-2">
          <strong>Contact:</strong> {provider.contact}
        </p>
      )}
      {provider.location && (
        <p className="mb-2">
          <strong>Location:</strong> {provider.location}
        </p>
      )}
      {provider.categories && provider.categories.length > 0 && (
        <div className="mt-4">
          <strong>Categories:</strong>
          <ul className="ml-4 list-disc">
            {provider.categories.map(category => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        </div>
      )}
      <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto">
        {JSON.stringify(provider, null, 2)}
      </pre>
    </div>
  );
}
