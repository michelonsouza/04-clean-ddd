import type { AnswerComment } from '../../enterprise/entities/answer-comment';
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface ListAnswerCommentsUseCaseParams {
  answerId: string;
  page: number;
}

interface ListAnswerCommentsUseCaseResponse {
  data: AnswerComment[];
}

export class ListAnswerCommentsUseCase {
  #answerCommentsRepository: AnswerCommentsRepository;

  constructor(AnswerCommentsRepository: AnswerCommentsRepository) {
    this.#answerCommentsRepository = AnswerCommentsRepository;
  }

  async execute({
    page,
    answerId,
  }: ListAnswerCommentsUseCaseParams): Promise<ListAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.#answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return {
      data: answerComments,
    };
  }
}
