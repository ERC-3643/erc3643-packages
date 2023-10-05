import 'reflect-metadata';
import { Container, Inject, Service } from 'typedi';

export class InjectedClassTsyringe {
  ping() {
    console.log('Hello! InjectedClassTsyringe');
  }
}

@Service()
export class InjectedClass {
  ping() {
    console.log('Hello!');
  }
}

@Service()
class ExampleClass {
  @Inject(() => InjectedClass)
  injectedClass: InjectedClass;
}

export const instancePing = Container.get(ExampleClass);