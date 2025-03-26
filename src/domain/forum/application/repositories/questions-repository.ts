import type { Repository } from '@/core/repositories/repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

export interface QuestionsRepository extends Repository<Question> {
  findBySlug(slug: string): Promise<Question | null>;
}
