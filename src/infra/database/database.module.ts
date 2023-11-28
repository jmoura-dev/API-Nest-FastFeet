import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdministratorsRepository } from '@/domain/shippingCompany/application/repositories/administrators-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { OrdersRepository } from '@/domain/shippingCompany/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { RecipientsRepository } from '@/domain/shippingCompany/application/repositories/recipients-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { DeliverymansRepository } from '@/domain/shippingCompany/application/repositories/deliverymans-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notification-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdministratorsRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: DeliverymansRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdministratorsRepository,
    DeliverymansRepository,
    OrdersRepository,
    RecipientsRepository,
  ],
})
export class DatabaseModule {}
