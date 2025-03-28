import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  #questions: Question[] = [];

  async create(question: Question) {
    this.#questions.push(question);

    return Promise.resolve();
  }

  async save(question: Question) {
    const index = this.#questions.findIndex(
      q => q.id.toValue() === question.id.toValue(),
    );

    this.#questions[index] = question;

    return Promise.resolve();
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question =
      this.#questions.find(question => question.slug.value === slug) ?? null;

    return question;
  }

  async findById(id: string): Promise<Question | null> {
    const question =
      this.#questions.find(question => question.id.toValue() === id) ?? null;

    return Promise.resolve(question);
  }

  async delete(question: Question): Promise<void> {
    const questions = this.#questions.filter(
      q => q.id.toValue() !== question.id.toValue(),
    );

    this.#questions = questions;

    return Promise.resolve();
  }

  get items() {
    return this.#questions;
  }
}
