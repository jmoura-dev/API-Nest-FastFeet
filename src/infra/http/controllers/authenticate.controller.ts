import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { Public } from '@/infra/auth/public'
import { AuthenticateUseCase } from '@/domain/shippingCompany/application/use-cases/authenticate'
import { CredentialsDoNotMatch } from '@/core/errors/errors/credentials-do-not-match'

const AuthenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof AuthenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(AuthenticateBodySchema))
  async create(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateUser.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CredentialsDoNotMatch:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
