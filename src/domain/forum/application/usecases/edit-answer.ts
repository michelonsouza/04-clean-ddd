import type { Answer } from '../../enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';

interface EditAnswerUseCaseParams {
  answerId: string;
  authorId: string;
  content: string;
}

interface EditAnswerUseCaseResponse {
  data: Answer;
}

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
      throw new Error('Answer not found');
    }

    const isAnswerAuthor = answer.authorId.toValue() === authorId;

    if (!isAnswerAuthor) {
      throw new Error('Not Allowed');
    }

    answer.content = content;

    await this.#answersRepository.save(answer);

    return {
      data: answer,
    };
  }
}
