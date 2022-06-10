import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain/usecases";
import { LocalLoadPurchases } from "./index";

import { faker } from "@faker-js/faker";

const mockPurchases = (): SavePurchases.Params[] => [
  {
    id: faker.datatype.uuid(),
    date: faker.date.recent(),
    value: faker.datatype.number(),
  },
  {
    id: faker.datatype.uuid(),
    date: faker.date.recent(),
    value: faker.datatype.number(),
  },
];

class CacheStoreSpy implements CacheStore {
  actions: CacheStoreSpy.Action[] = [];
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deleteKey?: string;
  insertKey?: string;
  insertValues: SavePurchases.Params[] = [];

  delete (key: string): void {
    this.actions.push(CacheStoreSpy.Action.delete);
    this.deleteCallsCount++;
    this.deleteKey = key;
  }

  insert (key: string, value: any): void {
    this.actions.push(CacheStoreSpy.Action.insert);
    this.insertCallsCount++;
    this.insertKey = key;
    this.insertValues = value;
  }
}

namespace CacheStoreSpy {
  export enum Action {
    delete,
    insert,
  }
}

type SutTypes = {
  sut: LocalLoadPurchases;
  cacheStoreSpy: CacheStoreSpy;
};

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStoreSpy = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStoreSpy, timestamp);

  return {
    sut,
    cacheStoreSpy,
  };
};

describe('LocalLoadPurchases Usecase', () => {
  test('Should not delete or insert cache on init', () => {
    const { cacheStoreSpy } = makeSut();
    expect(cacheStoreSpy.actions).toEqual([]);
  });
});
