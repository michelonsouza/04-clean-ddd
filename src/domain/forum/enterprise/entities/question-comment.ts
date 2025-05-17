import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface QuestionCommentConstructorParams {
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionComment extends Entity<QuestionCommentConstructorParams> {
  static create(
    { createdAt, ...params }: QuestionCommentConstructorParams,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      {
        ...params,
        createdAt: createdAt ?? new Date(),
      },
      id,
    );

    return questionComment;
  }

  #touch() {
    this.params.updatedAt = new Date();
  }

  get authorId(): UniqueEntityID {
    return this.params.authorId;
  }

  get questionId(): UniqueEntityID {
    return this.params.questionId;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.params.updatedAt;
  }

  get content(): string {
    return this.params.content;
  }

  set content(content: string) {
    this.params.content = content;
    this.#touch();
  }
}
