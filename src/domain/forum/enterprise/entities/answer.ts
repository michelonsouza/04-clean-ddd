import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface AnswerConstructorParams {
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends Entity<AnswerConstructorParams> {
  static create(
    { createdAt, ...params }: Optional<AnswerConstructorParams, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...params,
        createdAt: createdAt ?? new Date(),
      },
      id,
    );

    return answer;
  }

  #touch() {
    this.params.updatedAt = new Date();
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  get content(): string {
    return this.params.content;
  }

  set content(content: string) {
    this.params.content = content;
    this.#touch();
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

  get updatedAt(): Date | undefined {
    return this.params.updatedAt;
  }
}
