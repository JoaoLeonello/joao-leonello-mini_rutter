export interface SyncOrdersUseCase {
  execute(): AsyncGenerator<void | undefined>;
  }