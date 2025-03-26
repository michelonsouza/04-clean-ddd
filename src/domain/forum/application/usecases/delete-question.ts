import type { QuestionsRepository } from '../repositories/questions-repository';

interface DeleteQuestionUseCaseParams {
  questionId: string;
  authorId: string;
}

export class DeleteQuestionUseCase {
  #questionsRepository: QuestionsRepository;

  constructor(questionsRepository: QuestionsRepository) {
    this.#questionsRepository = questionsRepository;
  }

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseParams): Promise<void> {
    const question = await this.#questionsRepository.findById(questionId);

    if (!question) {
      throw new Error('Question not found');
    }

    const isQuestionAuthor = question.authorId.toValue() === authorId;

    if (!isQuestionAuthor) {
      throw new Error('Not Allowed');
    }

    await this.#questionsRepository.delete(question);
  }
}
