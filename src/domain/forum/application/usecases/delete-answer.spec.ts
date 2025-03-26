import { fakerPT_BR as faker } from '@faker-js/faker';

import { makeAnswer } from '__tests__/factories/make-answer';
import { InMemoryAnswersRepository } from '__tests__/repositories/in-memory-answers-repository';

import { DeleteAnswerUseCase } from './delete-answer';

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

    await expect(
      sut.execute({
        answerId: answer.id.toValue(),
        authorId: wrongAuthorId,
      }),
    ).rejects.toBeInstanceOf(Error);

    expect(inMemoryAnswersRepository.items).toEqual(
      expect.arrayContaining([answer]),
    );
  });

  it('should not be able to delete a not found answer', async () => {
    await expect(
      sut.execute({
        answerId: faker.string.uuid(),
        authorId: faker.string.uuid(),
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
