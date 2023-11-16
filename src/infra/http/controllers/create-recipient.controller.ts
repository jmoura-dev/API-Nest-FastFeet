import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateRecipientUseCase } from '@/domain/shippingCompany/application/use-cases/create-recipient'

const createRecipientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  city: z.string(),
  neighborhood: z.string(),
  houseNumber: z.number(),
  latitude: z.number(),
  longitude: z.number(),
})

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
export class CreateRecipientsController {
  constructor(private recipientUseCase: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async create(@Body() body: CreateRecipientBodySchema) {
    const {
      name,
      email,
      password,
      city,
      neighborhood,
      houseNumber,
      latitude,
      longitude,
    } = body

    const hashedPassword = await hash(password, 8)

    await this.recipientUseCase.execute({
      name,
      email,
      password: hashedPassword,
      city,
      neighborhood,
      houseNumber,
      latitude,
      longitude,
    })
  }
}
