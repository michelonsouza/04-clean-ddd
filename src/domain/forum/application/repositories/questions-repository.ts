import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Repository } from '@/core/repositories/repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

export interface QuestionsRepository extends Repository<Question> {
  findBySlug(slug: string): Promise<Question | null>;
  findManyRecent(params: PaginationParams): Promise<Question[]>;
}
