import { differenceInDays } from 'date-fns';

import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { QuestionAttachment } from './question-attachment';
import { Slug } from './value-objects/slug';

export interface QuestionConstructorParams {
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID;
  slug: Slug;
  title: string;
  content: string;
  attachments: QuestionAttachment[];
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionConstructorParams> {
  static create(
    {
      createdAt,
      ...params
    }: Optional<
      QuestionConstructorParams,
      'createdAt' | 'slug' | 'attachments'
    >,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...params,
        attachments: params?.attachments ?? [],
        slug: params?.slug ?? Slug.createFromText(params.title),
        createdAt: createdAt ?? new Date(),
      },
      id,
    );

    return question;
  }

  #touch() {
    this.params.updatedAt = new Date();
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  get isNew(): boolean {
    return differenceInDays(new Date(), this.createdAt) <= 3; // 3 days
  }

  get authorId(): UniqueEntityID {
    return this.params.authorId;
  }

  get bestAnswerId(): UniqueEntityID | undefined {
    return this.params.bestAnswerId;
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    this.params.bestAnswerId = bestAnswerId;
    this.#touch();
  }

  get slug(): Slug {
    return this.params.slug;
  }

  get title(): string {
    return this.params.title;
  }

  set title(title: string) {
    this.params.title = title;
    this.params.slug = Slug.createFromText(title);
    this.#touch();
  }

  get content(): string {
    return this.params.content;
  }

  set content(content: string) {
    this.params.content = content;
    this.#touch();
  }

  get attachments(): QuestionAttachment[] {
    return this.params.attachments;
  }

  set attachments(attachments: QuestionAttachment[]) {
    this.params.attachments = attachments;
    this.#touch();
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.params.updatedAt;
  }
}
