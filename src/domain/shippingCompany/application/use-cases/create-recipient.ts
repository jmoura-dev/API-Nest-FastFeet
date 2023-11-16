import { Either, left, right } from '@/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { EmailAlreadyExists } from '@/core/errors/errors/email-already-exists'
import { Injectable } from '@nestjs/common'

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

type CreateRecipientUseCaseResponse = Either<EmailAlreadyExists, null>

@Injectable()
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

    const recipientWithSameEmail =
      await this.recipientsRepository.findByEmail(email)

    if (recipientWithSameEmail) {
      return left(new EmailAlreadyExists())
    }

    await this.recipientsRepository.create(recipient)

    return right(null)
  }
}
