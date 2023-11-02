export class UnsafeOperationAdapter {
  async executeOrCatch<T, K>(
    fn: () => Promise<K>,
    onSucces?: (args: any) => Promise<T>,
    onError?: (args: any) => void,
  ): Promise<T> {
    try {
      const result = await fn();
      if (onSucces) return onSucces(result);
    } catch (error) {
      if (onError) onError(error);
    }
  }
}
