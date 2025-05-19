import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface DeleteAnswerCommentUseCaseParams {
  authorId: string;
  answerCommentId: string;
}

export class DeleteAnswerCommentUseCase {
  #answerCommentsRepository: AnswerCommentsRepository;

  constructor(answerCommentsRepository: AnswerCommentsRepository) {
    this.#answerCommentsRepository = answerCommentsRepository;
  }

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseParams): Promise<void> {
    const answerComment =
      await this.#answerCommentsRepository.findById(answerCommentId);

    if (!answerComment) {
      throw new Error('Answer comment not found');
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error('Not Allowed');
    }

    await this.#answerCommentsRepository.delete(answerComment);
  }
}
