import { FetchDeliveriesFromDeliverymanUseCase } from '@/domain/shippingCompany/application/use-cases/fetch-deliveries-from-deliveryman'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/orders/deliverymans/:deliverymanId')
export class FetchDeliveriesFromDeliverymanController {
  constructor(
    private fetchDeliveriesFromDeliveryman: FetchDeliveriesFromDeliverymanUseCase,
  ) {}

  @Get()
  async handle(
    @Param('deliverymanId') deliverymanId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchDeliveriesFromDeliveryman.execute({
      page,
      deliverymanId,
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
