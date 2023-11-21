import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { Public } from '@/infra/auth/public'

const createUserBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string().min(6),
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/users')
@Public()
export class CreateUsersController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async create(@Body() body: CreateUserBodySchema) {
    const { name, cpf, password } = body

    const checkedUserSameEmail = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (checkedUserSameEmail) {
      throw new ConflictException('User already exists with this cpf')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        cpf,
        password: hashedPassword,
      },
    })
  }
}
