import { useCallback, useRef, useState } from 'react';
import { AppError, defaultMessage } from '../api/errors';

type State<T> = {
  loading: boolean;
  data?: T;
  error?: AppError;
};

export function useApi<T>(fn: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<State<T>>({ loading: false });
  const controllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState({ loading: true });
    try {
      const data = await fn(controller.signal);
      setState({ loading: false, data });
      return { ok: true as const, data };
    } catch (e: any) {
      const err = e as AppError;
      setState({ loading: false, error: err });
      return { ok: false as const, error: err };
    }
  }, [fn]);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  return {
    ...state,
    run,
    cancel,
    message: state.error ? defaultMessage(state.error.code) : undefined,
  };
}
