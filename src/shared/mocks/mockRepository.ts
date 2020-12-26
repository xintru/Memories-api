import { FindConditions, UpdateResult } from 'typeorm'

export const mockRepository = <T>(mockedData?: T) =>
  jest.fn(() => ({
    metadata: {
      columns: [],
      relations: [],
    },
    save: (data?): Promise<T> => Promise.resolve(data),
    update: (criteria: any, partialEntity: Partial<T>): Promise<UpdateResult> =>
      Promise.resolve({ raw: '', affected: 1, generatedMaps: [] }),
    findOne: (conditions: FindConditions<T>): Promise<T> =>
      Promise.resolve(mockedData),
  }))
