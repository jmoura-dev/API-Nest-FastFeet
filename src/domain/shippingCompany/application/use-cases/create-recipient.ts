import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface CreateRecipientUseCaseRequest {
  name: string
  email: string
  password: string
  city: string
  neighborhood: string
  houseNumber: number
  latitude: number
  longitude: number
}

interface CreateRecipientUseCaseResponse {
  recipientCreated: void
}

export class CreateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    name,
    email,
    password,
    city,
    neighborhood,
    houseNumber,
    latitude,
    longitude,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      name,
      email,
      password,
      city,
      neighborhood,
      houseNumber,
      latitude,
      longitude,
    })

    const recipientCreated = await this.recipientsRepository.create(recipient)

    return { recipientCreated }
  }
}
