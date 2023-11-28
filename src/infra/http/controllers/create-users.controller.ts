import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { Public } from '@/infra/auth/public'
import { CreateAccountUseCase } from '@/domain/shippingCompany/application/use-cases/create-account'
import { CpfAlreadyExists } from '@/domain/shippingCompany/application/use-cases/errors/cpf-already-exists'

const createUserBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema)

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/users')
@Public()
export class CreateUsersController {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  @Post()
  @HttpCode(201)
  async create(@Body(bodyValidationPipe) body: CreateUserBodySchema) {
    const { name, cpf, password } = body

    const result = await this.createAccountUseCase.execute({
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CpfAlreadyExists:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
