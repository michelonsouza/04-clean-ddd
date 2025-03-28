import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswer } from '__tests__/factories/make-answer';
import { makeQuestion } from '__tests__/factories/make-question';
import { InMemoryAnswersRepository } from '__tests__/repositories/in-memory-answers-repository';
import { InMemoryQuestionsRepository } from '__tests__/repositories/in-memory-questions-repository';

import { ChoseQuestionBestAnswerUseCase } from './chose-question-best-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ChoseQuestionBestAnswerUseCase;

describe('ChoseQuestionBestAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new ChoseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    );
  });

  it('should be able to chose question best answer', async () => {
    const { question } = makeQuestion();
    const { answer } = makeAnswer({
      authorId: question.authorId,
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toValue(),
      authorId: question.authorId.toValue(),
    });

    expect(
      inMemoryQuestionsRepository.items[0].bestAnswerId?.toValue(),
    ).toEqual(answer.id.toValue());
  });

  it('should not be able to chose another user question best answer', async () => {
    const { question } = makeQuestion();
    const { answer } = makeAnswer({
      authorId: question.authorId,
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await expect(
      sut.execute({
        answerId: answer.id.toValue(),
        authorId: faker.string.uuid(),
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to chose not found question', async () => {
    const { answer } = makeAnswer({
      authorId: new UniqueEntityID(faker.string.uuid()),
      questionId: new UniqueEntityID(faker.string.uuid()),
    });

    await inMemoryAnswersRepository.create(answer);
    await expect(
      sut.execute({
        answerId: answer.id.toValue(),
        authorId: answer.authorId.toValue(),
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to chose not found answer', async () => {
    await expect(
      sut.execute({
        answerId: faker.string.uuid(),
        authorId: faker.string.uuid(),
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
