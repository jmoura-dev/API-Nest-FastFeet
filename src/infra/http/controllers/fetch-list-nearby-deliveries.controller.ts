import { ListNearbyDeliveriesUseCase } from '@/domain/shippingCompany/application/use-cases/list-nearby-deliveries'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Query,
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

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type CreateBodyOrdersSchema = z.infer<typeof createBodyOrdersSchema>
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/orders/:deliverymanId')
export class FetchListNearbyDeliveries {
  constructor(
    private listNearbyDeliveriesUseCase: ListNearbyDeliveriesUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: CreateBodyOrdersSchema,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { latitude, longitude } = body
    const { sub: deliverymanId } = user

    const result = await this.listNearbyDeliveriesUseCase.execute({
      page,
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
