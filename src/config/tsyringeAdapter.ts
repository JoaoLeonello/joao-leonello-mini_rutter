import { IocAdapter } from "routing-controllers";
import { DependencyContainer } from "tsyringe";

export class TsyringeAdapter implements IocAdapter {
  constructor(private container: DependencyContainer) {}

  get<T>(someClass: { new (...args: any[]): T }): T {
    return this.container.resolve(someClass);
  }
}
