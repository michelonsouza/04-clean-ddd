import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  #answers: Answer[] = [];

  async save(question: Answer) {
    const index = this.#answers.findIndex(
      q => q.id.toValue() === question.id.toValue(),
    );

    this.#answers[index] = question;

    return Promise.resolve();
  }

  async create(answer: Answer) {
    this.#answers.push(answer);
  }

  async findById(id: string): Promise<Answer | null> {
    const question =
      this.#answers.find(question => question.id.toValue() === id) ?? null;

    return Promise.resolve(question);
  }

  async delete(answer: Answer): Promise<void> {
    const answers = this.#answers.filter(
      currentAnswer => currentAnswer.id.toValue() !== answer.id.toValue(),
    );

    this.#answers = answers;

    return Promise.resolve();
  }

  get items() {
    return this.#answers;
  }
}
