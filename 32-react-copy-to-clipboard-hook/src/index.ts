import { useState, useCallback } from 'react';

export interface UseCopyOptions {
  timeout?: number;
}

export function useCopyToClipboard(options: UseCopyOptions = {}) {
  const { timeout = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        setError(new Error('Clipboard API not available'));
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);

        setTimeout(() => {
          setCopied(false);
        }, timeout);

        return true;
      } catch (err: any) {
        setError(err);
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  return { copy, copied, error, reset };
}
