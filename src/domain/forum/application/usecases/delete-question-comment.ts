import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface DeleteQuestionCommentUseCaseParams {
  authorId: string;
  questionCommentId: string;
}

export class DeleteQuestionCommentUseCase {
  #questionCommentsRepository: QuestionCommentsRepository;

  constructor(questionCommentsRepository: QuestionCommentsRepository) {
    this.#questionCommentsRepository = questionCommentsRepository;
  }

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseParams): Promise<void> {
    const questionComment =
      await this.#questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      throw new Error('Question comment not found');
    }

    if (questionComment.authorId.toString() !== authorId) {
      throw new Error('Not Allowed');
    }

    await this.#questionCommentsRepository.delete(questionComment);
  }
}
