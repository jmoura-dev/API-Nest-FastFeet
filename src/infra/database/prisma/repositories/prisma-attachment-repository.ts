import { PrismaService } from '../prisma.service'
import { PrismaAttachmentsMapper } from '../mappers/prisma-attachment-mapper'
import { Injectable } from '@nestjs/common'
import { AttachmentsRepository } from '@/domain/shippingCompany/application/repositories/attachments-repository'
import { Attachment } from '@/domain/shippingCompany/enterprise/entities/attachment'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentsMapper.toPrisma(attachment)

    await this.prisma.attachment.create({
      data,
    })
  }
}
