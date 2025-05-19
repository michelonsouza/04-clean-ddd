import { fakerPT_BR as faker } from '@faker-js/faker';

import { makeQuestion } from '__tests__/factories/make-question';
import { makeQuestionComment } from '__tests__/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from '__tests__/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from '__tests__/repositories/in-memory-questions-repository';

import { DeleteQuestionCommentUseCase } from './delete-question-comment';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('DeleteQuestionCommentUseCaseUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to delete a question comment', async () => {
    const { question } = makeQuestion();
    const { authorId, questionComment } = makeQuestionComment({
      questionId: question.id,
    });
    const questionCommentId = questionComment.id.toString();

    await inMemoryQuestionsRepository.create(question);
    await inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({ authorId, questionCommentId });

    const questionCommentDeleted =
      await inMemoryQuestionCommentsRepository.findById(questionCommentId);

    expect(questionCommentDeleted).toEqual(null);
  });

  it('should not be able to delete another user question comment', async () => {
    const { question } = makeQuestion();
    const { questionComment } = makeQuestionComment({
      questionId: question.id,
    });
    const questionCommentId = questionComment.id.toString();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryQuestionsRepository.create(question);
    await inMemoryQuestionCommentsRepository.create(questionComment);

    await expect(
      sut.execute({ authorId: wrongAuthorId, questionCommentId }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to delete not found question comment', async () => {
    const wrongAuthorId = faker.string.uuid();
    const wrongQuestionCommentId = faker.string.uuid();

    await expect(
      sut.execute({
        authorId: wrongAuthorId,
        questionCommentId: wrongQuestionCommentId,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
