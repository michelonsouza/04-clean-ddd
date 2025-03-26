import type { AnswersRepository } from '../repositories/answers-repository';

interface DeleteAnswerUseCaseParams {
  answerId: string;
  authorId: string;
}

export class DeleteAnswerUseCase {
  #answersRepository: AnswersRepository;

  constructor(answersRepository: AnswersRepository) {
    this.#answersRepository = answersRepository;
  }

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseParams): Promise<void> {
    const question = await this.#answersRepository.findById(answerId);

    if (!question) {
      throw new Error('Question not found');
    }

    const isQuestionAuthor = question.authorId.toValue() === authorId;

    if (!isQuestionAuthor) {
      throw new Error('Not Allowed');
    }

    await this.#answersRepository.delete(question);
  }
}
