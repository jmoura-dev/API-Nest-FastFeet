import { RecipientsRepository } from '@/domain/shippingCompany/application/repositories/recipients-repository'
import { Recipient } from '@/domain/shippingCompany/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async findById(id: string) {
    const recipient = this.items.find(
      (recipient) => recipient.id.toString() === id,
    )

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByEmail(email: string) {
    const recipient = this.items.find((recipient) => recipient.email === email)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }
}
