import { fakerPT_BR as faker } from '@faker-js/faker';

import { makeQuestion } from '__tests__/factories/make-question';
import { InMemoryQuestionsRepository } from '__tests__/repositories/in-memory-questions-repository';

import { EditQuestionUseCase } from './edit-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('EditQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to edit a question', async () => {
    const { question, authorId } = makeQuestion();
    const { question: editQuestion } = makeQuestion(
      { authorId: question.authorId, createdAt: question.createdAt },
      question.id.toString(),
    );

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
      authorId,
      questionId: question.id.toValue(),
      title: editQuestion.title,
      content: editQuestion.content,
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: editQuestion.title,
      content: editQuestion.content,
    });
  });

  it('should not be able to edit a question from another user', async () => {
    const { question } = makeQuestion();
    const { question: editQuestion } = makeQuestion();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryQuestionsRepository.create(question);

    await expect(
      sut.execute({
        questionId: question.id.toValue(),
        authorId: wrongAuthorId,
        title: editQuestion.title,
        content: editQuestion.content,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to edit a not found question', async () => {
    await expect(
      sut.execute({
        questionId: faker.string.uuid(),
        authorId: faker.string.uuid(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
