import { DependencyToken, ReportMeetingDependencies } from "@/ioc/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Newable<T> = new (...args: any[]) => T;

interface DependencyDefinition<T> {
  factory: (container: DIContainer) => T;
  singleton: boolean;
}

export class DIContainer {
  private readonly services = new Map<
    DependencyToken,
    DependencyDefinition<unknown>
  >();
  private readonly singletons = new Map<DependencyToken, unknown>();

  public register<K extends DependencyToken>(
    key: K,
    factory: (container: DIContainer) => ReportMeetingDependencies[K],
    options: { singleton?: boolean } = {}
  ): void {
    const definition: DependencyDefinition<ReportMeetingDependencies[K]> = {
      factory,
      singleton: options.singleton ?? true,
    };
    this.services.set(key, definition as DependencyDefinition<unknown>);
  }

  public registerClass<K extends DependencyToken>(
    key: K,
    ctor: Newable<ReportMeetingDependencies[K]>,
    deps: DependencyToken[] = [],
    options: { singleton?: boolean } = {}
  ): void {
    const factory = (container: DIContainer): ReportMeetingDependencies[K] => {
      const resolvedDeps = deps.map((depKey) => container.resolve(depKey));
      return new ctor(...resolvedDeps);
    };
    this.register(key, factory, options);
  }

  public resolve<K extends DependencyToken>(
    key: K
  ): ReportMeetingDependencies[K] {
    if (this.singletons.has(key)) {
      return this.singletons.get(key) as ReportMeetingDependencies[K];
    }

    const definition = this.services.get(key);
    if (!definition) {
      throw new Error(`Dependency with key "${key}" not registered.`);
    }

    const instance = definition.factory(this);

    if (definition.singleton) {
      this.singletons.set(key, instance);
    }

    return instance as ReportMeetingDependencies[K];
  }

  public clear(): void {
    this.services.clear();
    this.singletons.clear();
  }
}

export const container = new DIContainer();
