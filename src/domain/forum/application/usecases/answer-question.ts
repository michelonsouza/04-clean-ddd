import { type Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

import { AnswersRepository } from '../repositories/answers-repository';

interface AnswerQuestionUseCaseParams {
  instructorId: string;
  questionId: string;
  content: string;
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    data: Answer;
  }
>;

export class AnswerQuestionUseCase {
  #answersRepository: AnswersRepository;

  constructor(answersRepository: AnswersRepository) {
    this.#answersRepository = answersRepository;
  }

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseParams): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    });

    await this.#answersRepository.create(answer);

    return right({
      data: answer,
    });
  }
}
