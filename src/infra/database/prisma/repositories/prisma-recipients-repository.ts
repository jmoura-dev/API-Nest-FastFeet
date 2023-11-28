import { RecipientsRepository } from '@/domain/shippingCompany/application/repositories/recipients-repository'
import { Recipient } from '@/domain/shippingCompany/enterprise/entities/recipient'
import { PrismaService } from '../prisma.service'
import { PrismaRecipientsMapper } from '../mappers/prisma-recipients-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientsMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientsMapper.toDomain(recipient)
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        email,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientsMapper.toDomain(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientsMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
