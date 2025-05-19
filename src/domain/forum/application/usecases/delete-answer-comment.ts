import { type Either, left, right } from '@/core/either';

import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface DeleteAnswerCommentUseCaseParams {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  void
>;

export class DeleteAnswerCommentUseCase {
  #answerCommentsRepository: AnswerCommentsRepository;

  constructor(answerCommentsRepository: AnswerCommentsRepository) {
    this.#answerCommentsRepository = answerCommentsRepository;
  }

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseParams): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.#answerCommentsRepository.findById(answerCommentId);

    if (!answerComment) {
      return left(new ResourceNotFoundError('Answer comment'));
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.#answerCommentsRepository.delete(answerComment);

    return right(undefined);
  }
}
