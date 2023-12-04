import { AttachmentsRepository } from '@/domain/shippingCompany/application/repositories/attachments-repository'
import { Attachment } from '@/domain/shippingCompany/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }

  async findById(id: string) {
    const attachment = this.items.find(
      (attachment) => attachment.id.toString() === id,
    )

    if (!attachment) {
      return null
    }

    return attachment
  }
}
