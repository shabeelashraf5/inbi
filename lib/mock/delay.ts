export function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomDelay(min: number = 200, max: number = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return simulateDelay(ms);
}
