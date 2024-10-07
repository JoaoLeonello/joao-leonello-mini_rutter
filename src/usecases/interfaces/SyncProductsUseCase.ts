export interface SyncProductsUseCase {
  execute(): AsyncGenerator<void | undefined>;
}
