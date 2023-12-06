import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateUsersController } from './controllers/create-users.controller'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { CreateAccountUseCase } from '@/domain/shippingCompany/application/use-cases/create-account'
import { AuthenticateUseCase } from '@/domain/shippingCompany/application/use-cases/authenticate'
import { EditOrderStatusController } from './controllers/edit-order-status.controller'
import { EditOrderStatusUseCase } from '@/domain/shippingCompany/application/use-cases/edit-order-status'
import { FetchListNearbyDeliveriesController } from './controllers/fetch-list-nearby-deliveries.controller'
import { ListNearbyDeliveriesUseCase } from '@/domain/shippingCompany/application/use-cases/list-nearby-deliveries'
import { PickUpOrderForDeliveryController } from './controllers/pick-up-order-for-delivery.controller'
import { PickUpOrderForDeliveryUseCase } from '@/domain/shippingCompany/application/use-cases/pick-up-order-for-delivery'
import { MarkOrderAsDeliveredController } from './controllers/mark-order-as-delivered.controller'
import { MarkOrderAsDeliveredUseCase } from '@/domain/shippingCompany/application/use-cases/mark-order-as-delivered'
import { FetchDeliveriesFromRecipientController } from './controllers/fetch-deliveries-from-recipient.controller'
import { FetchDeliveriesFromRecipientUseCase } from '@/domain/shippingCompany/application/use-cases/fetch-deliveries-from-recipient'
import { FetchDeliveriesFromDeliverymanController } from './controllers/fetch-deliveries-from-deliveryman.controller'
import { FetchDeliveriesFromDeliverymanUseCase } from '@/domain/shippingCompany/application/use-cases/fetch-deliveries-from-deliveryman'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { StorageModule } from '../storage/storage.module'
import { UploadAndCreateAttachmentUseCase } from '@/domain/shippingCompany/application/use-cases/upload-and-create-attachment'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { ReadNotificationController } from './controllers/read-notification.controller'
import { IsAdminMiddleware } from '../middlewares/verify-is-admin-middleware'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule, AuthModule],
  controllers: [
    CreateUsersController,
    AuthenticateController,
    EditOrderStatusController,
    FetchListNearbyDeliveriesController,
    PickUpOrderForDeliveryController,
    MarkOrderAsDeliveredController,
    FetchDeliveriesFromRecipientController,
    FetchDeliveriesFromDeliverymanController,
    UploadAttachmentController,
    ReadNotificationController,
  ],
  providers: [
    IsAdminMiddleware,
    CreateAccountUseCase,
    AuthenticateUseCase,
    EditOrderStatusUseCase,
    ListNearbyDeliveriesUseCase,
    PickUpOrderForDeliveryUseCase,
    MarkOrderAsDeliveredUseCase,
    FetchDeliveriesFromRecipientUseCase,
    FetchDeliveriesFromDeliverymanUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
