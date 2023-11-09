import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateUsersController } from './controllers/create-users.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [CreateUsersController, AuthenticateController],
  providers: [PrismaService],
})
export class HttpModule {}
