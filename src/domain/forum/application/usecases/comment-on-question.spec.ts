import { makeQuestion } from '__tests__/factories/make-question';
import { makeQuestionComment } from '__tests__/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from '__tests__/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from '__tests__/repositories/in-memory-questions-repository';

import { CommentOnQuestionUseCase } from './comment-on-question';
import { ResourceNotFoundError } from './errors/resource-not-found';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CommentOnQuestionUseCase;

describe('CommentOnQuestionUseCaseUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it('should be able to create question comment', async () => {
    const { question } = makeQuestion();
    const { authorId, content, questionId } = makeQuestionComment({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({ authorId, questionId, content });

    const [questionCommentCreated] = inMemoryQuestionCommentsRepository.items;

    expect(questionCommentCreated.content).toEqual(content);
    expect(questionCommentCreated.authorId?.toString()).toEqual(authorId);
    expect(questionCommentCreated.questionId?.toString()).toEqual(questionId);
  });

  it('should not be able to create question comment on unexistent question', async () => {
    const { question } = makeQuestion();
    const { authorId, content, questionId } = makeQuestionComment({
      questionId: question.id,
    });

    const result = await sut.execute({ authorId, questionId, content });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
