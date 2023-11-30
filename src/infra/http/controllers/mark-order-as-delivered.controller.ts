import { MarkOrderAsDeliveredUseCase } from '@/domain/shippingCompany/application/use-cases/mark-order-as-delivered'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  MethodNotAllowedException,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { NotAllowed } from '@/core/errors/errors/not-allowed'

const createBodyValidationSchema = z.object({
  attachment: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createBodyValidationSchema)

type CreateBodyValidationSchema = z.infer<typeof createBodyValidationSchema>

@Controller('orders/:orderId/:deliverymanId/delivered')
export class MarkOrderAsDeliveredController {
  constructor(private markOrderAsDelivered: MarkOrderAsDeliveredUseCase) {}

  @Put()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
    @Body(bodyValidationPipe) body: CreateBodyValidationSchema,
  ) {
    const { sub: deliverymanId } = user
    const { attachment } = body

    const result = await this.markOrderAsDelivered.execute({
      deliverymanId,
      orderId,
      attachment,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowed:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
