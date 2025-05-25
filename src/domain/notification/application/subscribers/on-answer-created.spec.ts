import { MockInstance } from 'vitest';

import { makeAnswer } from '__tests__/factories/make-answer';
import { makeQuestion } from '__tests__/factories/make-question';
import { InMemoryAnswerAttachementsRepository } from '__tests__/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from '__tests__/repositories/in-memory-answers-repository';
import { InMemoryNotificationsRepository } from '__tests__/repositories/in-memory-notifications-repository';
import { InMemoryQuestionAttachementsRepository } from '__tests__/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from '__tests__/repositories/in-memory-questions-repository';

import { OnAnswerCreated } from './on-answer-created';
import {
  SendNotificationUseCase,
  SendNotificationUseCaseParams,
  SendNotificationUseCaseResponse,
} from '../usecases/send-notification';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;

let sendNotificationExecuteSpy: MockInstance<
  ({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseParams) => Promise<SendNotificationUseCaseResponse>
>;

describe('OnAnswerCreatedSubscriber', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
  });

  it('should send a notification when an answer is created', async () => {
    const { question } = makeQuestion();
    const { answer } = makeAnswer({ questionId: question.id });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await vi.waitFor(() =>
      expect(sendNotificationExecuteSpy).toHaveBeenCalled(),
    );
  });
});
