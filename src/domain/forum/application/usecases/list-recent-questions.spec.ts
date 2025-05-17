import { fakerPT_BR as faker } from '@faker-js/faker';
import { subDays } from 'date-fns';

import { makeQuestion } from '__tests__/factories/make-question';
import { InMemoryQuestionsRepository } from '__tests__/repositories/in-memory-questions-repository';

import { ListRecentQuestionsUseCase } from './list-recent-questions';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ListRecentQuestionsUseCase;

describe('ListRecentQuestionsUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to list recent questions', async () => {
    const questionsQuantity = faker.number.int({ min: 2, max: 20 });
    const createdAt = faker.date.past({ refDate: new Date() });
    const mockedQuestions = Array.from(
      { length: questionsQuantity },
      (_, index) => {
        const { question } = makeQuestion({
          createdAt: subDays(createdAt, index),
        });

        return question;
      },
    );

    await Promise.all(
      mockedQuestions.map(async question =>
        inMemoryQuestionsRepository.create(question),
      ),
    );

    const { data: questions } = await sut.execute({ page: 1 });

    expect(questions).toEqual(expect.arrayContaining(mockedQuestions));
    expect(questions[0].createdAt).toEqual(
      subDays(createdAt, questionsQuantity - 1),
    );
  });
});
