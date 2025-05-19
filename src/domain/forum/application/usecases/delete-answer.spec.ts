import { fakerPT_BR as faker } from '@faker-js/faker';

import { makeAnswer } from '__tests__/factories/make-answer';
import { InMemoryAnswersRepository } from '__tests__/repositories/in-memory-answers-repository';

import { DeleteAnswerUseCase } from './delete-answer';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe('DeleteAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to delete a answer by id', async () => {
    const { answer, authorId } = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({ answerId: answer.id.toValue(), authorId });

    expect(inMemoryAnswersRepository.items).not.toEqual(
      expect.arrayContaining([answer]),
    );
  });

  it('should not be able to delete a answer from another user', async () => {
    const { answer } = makeAnswer();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      authorId: wrongAuthorId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryAnswersRepository.items).toEqual(
      expect.arrayContaining([answer]),
    );
  });

  it('should not be able to delete a not found answer', async () => {
    const result = await sut.execute({
      answerId: faker.string.uuid(),
      authorId: faker.string.uuid(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
