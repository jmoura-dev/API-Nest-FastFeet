import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateUsersController } from './controllers/create-users.controller'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { CreateAccountUseCase } from '@/domain/shippingCompany/application/use-cases/create-account'
import { AuthenticateUseCase } from '@/domain/shippingCompany/application/use-cases/authenticate'
import { EditOrderStatusController } from './controllers/edit-order-status.controller'
import { EditOrderStatusUseCase } from '@/domain/shippingCompany/application/use-cases/edit-order-status'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateUsersController,
    AuthenticateController,
    EditOrderStatusController,
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateUseCase,
    EditOrderStatusUseCase,
  ],
})
export class HttpModule {}
