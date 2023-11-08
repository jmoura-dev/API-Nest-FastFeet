import { Either, left, right } from '@/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { AdministratorsRepository } from '../repositories/administrators-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'

interface EditPasswordRecipientUseCaseRequest {
  administratorId: string
  email: string
  password: string
}

type EditPasswordRecipientUseCaseResponse = Either<
  ResourceNotFound,
  {
    recipient: Recipient
  }
>

export class EditPasswordRecipientUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    administratorId,
    email,
    password,
  }: EditPasswordRecipientUseCaseRequest): Promise<EditPasswordRecipientUseCaseResponse> {
    const administrator =
      await this.administratorsRepository.findById(administratorId)

    if (!administrator) {
      return left(new ResourceNotFound())
    }

    const recipient = await this.recipientsRepository.findByEmail(email)

    if (!recipient) {
      return left(new ResourceNotFound())
    }

    recipient.password = password

    await this.recipientsRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
