import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async use(_: unknown, __: unknown, next: () => void) {
    const request = _ as Request
    const token = request.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw new NotFoundException('[Token] Please log in again.')
    }

    try {
      const decodedToken = this.jwt.verify(token) as { sub: string } // Certifique-se de validar o tipo do payload
      const userId = decodedToken.sub

      const loggedUser = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!loggedUser) {
        throw new NotFoundException('Invalid user, please log in again.')
      }

      if (loggedUser.role === 'DELIVERYMAN') {
        throw new UnauthorizedException('You are not allowed.')
      }

      next()
    } catch (error) {
      throw new NotFoundException('Please log in again.') // Trate o erro conforme necessário
    }
  }
}
