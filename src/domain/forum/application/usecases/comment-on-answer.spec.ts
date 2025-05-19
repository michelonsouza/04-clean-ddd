import { makeAnswer } from '__tests__/factories/make-answer';
import { makeAnswerComment } from '__tests__/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from '__tests__/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from '__tests__/repositories/in-memory-answers-repository';

import { CommentOnAnswerUseCase } from './comment-on-answer';
import { ResourceNotFoundError } from './errors/resource-not-found';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: CommentOnAnswerUseCase;

describe('CommentOnAnswerUseCaseUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );
  });

  it('should be able to create answer comment', async () => {
    const { answer } = makeAnswer();
    const { authorId, content, answerId } = makeAnswerComment({
      answerId: answer.id,
    });

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({ authorId, answerId, content });

    const [answerCommentCreated] = inMemoryAnswerCommentsRepository.items;

    expect(answerCommentCreated.content).toEqual(content);
    expect(answerCommentCreated.authorId?.toString()).toEqual(authorId);
    expect(answerCommentCreated.answerId?.toString()).toEqual(answerId);
  });

  it('should not be able to create answer comment on unexistent answer', async () => {
    const { answer } = makeAnswer();
    const { authorId, content, answerId } = makeAnswerComment({
      answerId: answer.id,
    });

    const result = await sut.execute({ authorId, answerId, content });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
