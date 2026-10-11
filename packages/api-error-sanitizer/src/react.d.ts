declare module 'react' {
  export type DependencyList = ReadonlyArray<unknown>;
  export function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: DependencyList): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
}
