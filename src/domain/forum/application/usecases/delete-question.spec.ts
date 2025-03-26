import { fakerPT_BR as faker } from '@faker-js/faker';

import { makeQuestion } from '__tests__/factories/make-question';
import { InMemoryQuestionsRepository } from '__tests__/repositories/in-memory-questions-repository';

import { DeleteQuestionUseCase } from './delete-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe('DeleteQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to delete a question by id', async () => {
    const { question, authorId } = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({ questionId: question.id.toValue(), authorId });

    expect(inMemoryQuestionsRepository.items).not.toEqual(
      expect.arrayContaining([question]),
    );
  });

  it('should not be able to delete a question from another user', async () => {
    const { question } = makeQuestion();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryQuestionsRepository.create(question);

    await expect(
      sut.execute({
        questionId: question.id.toValue(),
        authorId: wrongAuthorId,
      }),
    ).rejects.toBeInstanceOf(Error);

    expect(inMemoryQuestionsRepository.items).toEqual(
      expect.arrayContaining([question]),
    );
  });

  it('should not be able to delete a not found question', async () => {
    await expect(
      sut.execute({
        questionId: faker.string.uuid(),
        authorId: faker.string.uuid(),
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
