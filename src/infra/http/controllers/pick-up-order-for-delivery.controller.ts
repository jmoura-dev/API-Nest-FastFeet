import { PickUpOrderForDeliveryUseCase } from '@/domain/shippingCompany/application/use-cases/pick-up-order-for-delivery'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

@Controller('/orders/:orderId/:deliverymanId')
export class PickUpOrderForDelivery {
  constructor(private pickUpOrderForDelivery: PickUpOrderForDeliveryUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { sub: deliverymanId } = user

    const result = await this.pickUpOrderForDelivery.execute({
      deliverymanId,
      orderId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
