import type { Question } from '../../enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';

interface GetQuestionBySlugUseCaseParams {
  slug: string;
}

interface GetQuestionBySlugUseCaseResponse {
  data: Question;
}

export class GetQuestionBySlugUseCase {
  #questionsRepository: QuestionsRepository;

  constructor(questionsRepository: QuestionsRepository) {
    this.#questionsRepository = questionsRepository;
  }

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseParams): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.#questionsRepository.findBySlug(slug);

    if (!question) {
      throw new Error('Question not found');
    }

    return {
      data: question,
    };
  }
}
