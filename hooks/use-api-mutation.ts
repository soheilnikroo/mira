import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

import type { FunctionReference } from 'convex/server';

export const useApiMutation = (mutation: FunctionReference<'mutation'>) => {
  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutation);

  const mutate = async (args: FunctionReference<'mutation'>['_args']) => {
    setPending(true);
    try {
      const result = await apiMutation(args);
      setPending(false);
      return result;
    } catch (error) {
      toast.error('Failed to execute mutation', {
        description: 'Please try again later.',
        action: {
          label: 'Try again',
          onClick: () => mutate(args),
        },
      });
      console.error(error);
    }
    setPending(false);
  };

  return { pending, mutate };
};
