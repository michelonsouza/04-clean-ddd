import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface CreateQuestionUseCaseParams {
  authorId: string;
  title: string;
  content: string;
}

interface CreateQuestionUseCaseResponse {
  data: Question;
}

export class CreateQuestionUseCase {
  #questionsRepository: QuestionsRepository;

  constructor(questionsRepository: QuestionsRepository) {
    this.#questionsRepository = questionsRepository;
  }

  async execute({
    authorId,
    content,
    title,
  }: CreateQuestionUseCaseParams): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      content,
      title,
    });

    await this.#questionsRepository.create(question);

    return {
      data: question,
    };
  }
}
