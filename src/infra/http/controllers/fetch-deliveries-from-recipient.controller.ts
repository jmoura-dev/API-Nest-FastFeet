import { FetchDeliveriesFromRecipientUseCase } from '@/domain/shippingCompany/application/use-cases/fetch-deliveries-from-recipient'
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

@Controller('/orders/recipients/:recipientId')
export class FetchDeliveriesFromRecipientController {
  constructor(
    private fetchDeliveriesFromRecipient: FetchDeliveriesFromRecipientUseCase,
  ) {}

  @Get()
  async handle(
    @Param('recipientId') recipientId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchDeliveriesFromRecipient.execute({
      page,
      recipientId,
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
