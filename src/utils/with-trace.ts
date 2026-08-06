/** Re-warns every 3s while `promise` is pending, so a stall names its step. */
export async function withTrace<T>(
  step: string,
  promise: Promise<T>,
): Promise<T> {
  const started = Date.now();
  const timer = setInterval(() => {
    const seconds = Math.round((Date.now() - started) / 1000);
    console.warn(`[trace] still in ${step} (${seconds}s)`);
  }, 3000);
  try {
    return await promise;
  } finally {
    clearInterval(timer);
  }
}
