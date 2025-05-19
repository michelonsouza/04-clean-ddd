import { type Either, left, right } from '@/core/either';

import type { Question } from '../../enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface GetQuestionBySlugUseCaseParams {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    data: Question;
  }
>;

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
      return left(new ResourceNotFoundError('Question'));
    }

    return right({
      data: question,
    });
  }
}
