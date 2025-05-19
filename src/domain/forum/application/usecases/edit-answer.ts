import { type Either, left, right } from '@/core/either';

import type { Answer } from '../../enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface EditAnswerUseCaseParams {
  answerId: string;
  authorId: string;
  content: string;
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    data: Answer;
  }
>;

export class EditAnswerUseCase {
  #answersRepository: AnswersRepository;

  constructor(answersRepository: AnswersRepository) {
    this.#answersRepository = answersRepository;
  }

  async execute({
    answerId,
    authorId,
    content,
  }: EditAnswerUseCaseParams): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.#answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError('Answer'));
    }

    const isAnswerAuthor = answer.authorId.toValue() === authorId;

    if (!isAnswerAuthor) {
      return left(new NotAllowedError());
    }

    answer.content = content;

    await this.#answersRepository.save(answer);

    return right({
      data: answer,
    });
  }
}
