import { EditOrderStatusUseCase } from '@/domain/shippingCompany/application/use-cases/edit-order-status'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const createEditOrderBodySchema = z.object({
  status: z.string(),
  title: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createEditOrderBodySchema)

type CreateEditOrderBodySchema = z.infer<typeof createEditOrderBodySchema>

@Controller('/orders/:orderId')
export class EditOrderStatusController {
  constructor(private editOrderStatusUseCase: EditOrderStatusUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: CreateEditOrderBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { status, title } = body
    const { sub: userId } = user

    const result = await this.editOrderStatusUseCase.execute({
      administratorId: userId,
      orderId,
      status,
      title,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
