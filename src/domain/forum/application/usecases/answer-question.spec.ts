import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryAnswersRepository } from '__tests__/repositories/in-memory-answers-repository';

import { AnswerQuestionUseCase } from './answer-question';

let inMemoryQuestionsRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe('AnswerQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should create an answer with the provided content', async () => {
    const instructorId = faker.string.uuid();
    const questionId = faker.string.uuid();
    const content = faker.lorem.sentence();

    const result = await sut.execute({
      instructorId,
      questionId,
      content,
    });

    const answer = result.value?.data;

    expect(answer?.content).toEqual(content);
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(answer?.id);
  });
});
