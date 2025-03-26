import { fakerPT_BR as faker } from '@faker-js/faker';

import { makeAnswer } from '__tests__/factories/make-answer';
import { InMemoryAnswersRepository } from '__tests__/repositories/in-memory-answers-repository';

import { EditAnswerUseCase } from './edit-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('EditAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to edit a answer', async () => {
    const { answer, authorId } = makeAnswer();
    const { answer: editAnswer } = makeAnswer(
      { authorId: answer.authorId, createdAt: answer.createdAt },
      answer.id.toString(),
    );

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      authorId,
      answerId: answer.id.toValue(),
      content: editAnswer.content,
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: editAnswer.content,
    });
  });

  it('should not be able to edit a answer from another user', async () => {
    const { answer } = makeAnswer();
    const { answer: editAnswer } = makeAnswer();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryAnswersRepository.create(answer);

    await expect(
      sut.execute({
        answerId: answer.id.toValue(),
        authorId: wrongAuthorId,
        content: editAnswer.content,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to edit a not found answer', async () => {
    await expect(
      sut.execute({
        answerId: faker.string.uuid(),
        authorId: faker.string.uuid(),
        content: faker.lorem.paragraph(),
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
