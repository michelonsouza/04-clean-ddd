import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Question,
  QuestionConstructorParams,
} from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

export function makeQuestion(
  override: Partial<QuestionConstructorParams> = {},
  id?: string,
) {
  const authorId = override?.authorId?.toValue() ?? faker.string.uuid();
  const title = override.title ?? faker.lorem.sentence();
  const content = override.content ?? faker.lorem.sentence();
  const slug =
    override?.slug?.value ??
    faker.helpers.slugify(title).toLowerCase().replace('.', '');

  const question = Question.create(
    {
      authorId: new UniqueEntityID(authorId),
      content,
      title,
      slug: Slug.create(slug),
      ...override,
    },
    id ? new UniqueEntityID(id) : undefined,
  );

  return {
    authorId,
    content,
    question,
    slug,
    title,
  };
}
