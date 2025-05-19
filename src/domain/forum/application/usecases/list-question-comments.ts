import type { QuestionComment } from '../../enterprise/entities/question-comment';
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface ListQuestionCommentsUseCaseParams {
  questionId: string;
  page: number;
}

interface ListQuestionCommentsUseCaseResponse {
  data: QuestionComment[];
}

export class ListQuestionCommentsUseCase {
  #questionCommentsRepository: QuestionCommentsRepository;

  constructor(questionCommentsRepository: QuestionCommentsRepository) {
    this.#questionCommentsRepository = questionCommentsRepository;
  }

  async execute({
    page,
    questionId,
  }: ListQuestionCommentsUseCaseParams): Promise<ListQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.#questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    return {
      data: questionComments,
    };
  }
}
