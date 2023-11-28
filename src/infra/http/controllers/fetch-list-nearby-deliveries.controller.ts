import { ListNearbyDeliveriesUseCase } from '@/domain/shippingCompany/application/use-cases/list-nearby-deliveries'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { OrderPresenter } from '../presenters/order-presenter'

const createBodyOrdersSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createBodyOrdersSchema)

type CreateBodyOrdersSchema = z.infer<typeof createBodyOrdersSchema>

@Controller('/orders/:deliverymanId')
export class FetchListNearbyDeliveries {
  constructor(
    private listNearbyDeliveriesUseCase: ListNearbyDeliveriesUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: CreateBodyOrdersSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { latitude, longitude } = body
    const { sub: deliverymanId } = user

    const result = await this.listNearbyDeliveriesUseCase.execute({
      deliverymanId,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return {
      orders: orders.map((order) => OrderPresenter.toHttp(order)),
    }
  }
}
