import { fakerPT_BR as faker } from '@faker-js/faker';

import { makeQuestion } from '__tests__/factories/make-question';
import { InMemoryQuestionsRepository } from '__tests__/repositories/in-memory-questions-repository';

import { GetQuestionBySlugUseCase } from './get-question-by-slug';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('GetQuestionBySlugUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get question by slug', async () => {
    const { question: newQuestion, content, slug } = makeQuestion();

    await inMemoryQuestionsRepository.create(newQuestion);

    const { data: question } = await sut.execute({ slug });

    expect(question.content).toEqual(content);
    expect(question.slug.value).toEqual(slug);
  });

  it('should not be able to get a not found question', async () => {
    await expect(
      sut.execute({
        slug: faker.helpers.slugify(faker.lorem.sentence({ min: 3, max: 5 })),
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
