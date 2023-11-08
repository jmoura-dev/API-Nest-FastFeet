import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { NotAllowed } from '@/core/errors/errors/not-allowed'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFound())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowed())
    }

    notification.read()

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
