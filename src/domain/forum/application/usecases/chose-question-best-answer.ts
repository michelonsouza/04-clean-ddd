import type { Question } from '@/domain/forum/enterprise/entities/question';

import type { AnswersRepository } from '../repositories/answers-repository';
import type { QuestionsRepository } from '../repositories/questions-repository';

export interface ChoseQuestionBestAnswerUseCaseParams {
  answerId: string;
  authorId: string;
}

interface ChoseQuestionBestAnswerUseCaseResponse {
  data: Question;
}

export class ChoseQuestionBestAnswerUseCase {
  #answersRepository: AnswersRepository;
  #questionsRepository: QuestionsRepository;

  constructor(
    questionsRepository: QuestionsRepository,
    answersRepository: AnswersRepository,
  ) {
    this.#questionsRepository = questionsRepository;
    this.#answersRepository = answersRepository;
  }

  async execute({
    answerId,
    authorId,
  }: ChoseQuestionBestAnswerUseCaseParams): Promise<ChoseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.#answersRepository.findById(answerId);

    if (!answer) {
      throw new Error('Answer not found');
    }

    const question = await this.#questionsRepository.findById(
      answer.questionId.toString(),
    );

    if (!question) {
      throw new Error('Question not found');
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this question');
    }

    question.bestAnswerId = answer.id;

    await this.#questionsRepository.save(question);

    return {
      data: question,
    };
  }
}
