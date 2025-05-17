import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface AnswerCommentConstructorParams {
  authorId: UniqueEntityID;
  answerId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class AnswerComment extends Entity<AnswerCommentConstructorParams> {
  static create(
    { createdAt, ...params }: AnswerCommentConstructorParams,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...params,
        createdAt: createdAt ?? new Date(),
      },
      id,
    );

    return answerComment;
  }

  #touch() {
    this.params.updatedAt = new Date();
  }

  get authorId(): UniqueEntityID {
    return this.params.authorId;
  }

  get answerId(): UniqueEntityID {
    return this.params.answerId;
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
