import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryQuestionsRepository } from '__tests__/repositories/in-memory-questions-repository';

import { CreateQuestionUseCase } from './create-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('CreateQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should create a question with the provided content', async () => {
    const authorId = faker.string.uuid();
    const title = faker.lorem.sentence();
    const content = faker.lorem.sentence();

    const result = await sut.execute({
      authorId,
      content,
      title,
    });

    const question = result.value?.data;

    expect(result.isRight()).toBe(true);
    expect(question?.content).toEqual(content);
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(question?.id);
  });
});
