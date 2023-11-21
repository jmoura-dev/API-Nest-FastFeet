import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdministratorsRepository } from '@/domain/shippingCompany/application/repositories/administrators-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdministratorsRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [PrismaService, AdministratorsRepository],
})
export class DatabaseModule {}
