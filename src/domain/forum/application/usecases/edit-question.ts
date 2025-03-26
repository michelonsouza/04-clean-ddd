import type { Question } from '../../enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';

interface EditQuestionUseCaseParams {
  questionId: string;
  authorId: string;
  title: string;
  content: string;
}

interface EditQuestionUseCaseResponse {
  data: Question;
}

export class EditQuestionUseCase {
  #questionsRepository: QuestionsRepository;

  constructor(questionsRepository: QuestionsRepository) {
    this.#questionsRepository = questionsRepository;
  }

  async execute({
    questionId,
    authorId,
    title,
    content,
  }: EditQuestionUseCaseParams): Promise<EditQuestionUseCaseResponse> {
    const question = await this.#questionsRepository.findById(questionId);

    if (!question) {
      throw new Error('Question not found');
    }

    const isQuestionAuthor = question.authorId.toValue() === authorId;

    if (!isQuestionAuthor) {
      throw new Error('Not Allowed');
    }

    question.title = title;
    question.content = content;

    await this.#questionsRepository.save(question);

    return {
      data: question,
    };
  }
}
