import { AttachmentsRepository } from '@/domain/shippingCompany/application/repositories/attachments-repository'
import { Attachment } from '@/domain/shippingCompany/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
