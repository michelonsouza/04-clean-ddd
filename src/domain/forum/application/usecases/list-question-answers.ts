import type { Answer } from '../../enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';

interface ListQuestionAnswersUseCaseParams {
  questionId: string;
  page: number;
}

interface ListQuestionAnswersUseCaseResponse {
  data: Answer[];
}

export class ListQuestionAnswersUseCase {
  #answersRepository: AnswersRepository;

  constructor(answersRepository: AnswersRepository) {
    this.#answersRepository = answersRepository;
  }

  async execute({
    page,
    questionId,
  }: ListQuestionAnswersUseCaseParams): Promise<ListQuestionAnswersUseCaseResponse> {
    const answers = await this.#answersRepository.findeManyByQuestionId(
      questionId,
      {
        page,
      },
    );

    return {
      data: answers,
    };
  }
}
