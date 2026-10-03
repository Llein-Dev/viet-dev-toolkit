export interface ShutdownOptions {
  timeoutMs?: number;
  signals?: NodeJS.Signals[];
}

export function registerShutdownHook(
  cleanup: () => Promise<void> | void,
  options: ShutdownOptions = {}
) {
  const { timeoutMs = 10000, signals = ['SIGTERM', 'SIGINT'] } = options;
  let isShuttingDown = false;

  const handleSignal = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.info(`[graceful-shutdown] Received ${signal}. Cleaning up...`);

    const timer = setTimeout(() => {
      console.error('[graceful-shutdown] Cleanup timed out. Forcing process exit.');
      process.exit(1);
    }, timeoutMs);

    try {
      await cleanup();
      clearTimeout(timer);
      console.info('[graceful-shutdown] Cleanup finished safely.');
      process.exit(0);
    } catch (err) {
      clearTimeout(timer);
      console.error('[graceful-shutdown] Error during cleanup:', err);
      process.exit(1);
    }
  };

  for (const sig of signals) {
    process.once(sig, () => handleSignal(sig));
  }
}
