import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { PrismaService } from '@/infra/prisma/prisma.service'

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(@CurrentUser() user: UserPayload, _: unknown, next: () => void) {
    const loggedUser = await this.prisma.user.findUnique({
      where: {
        id: user.sub,
      },
    })

    if (!loggedUser) {
      throw new NotFoundException('Please log in again.')
    }

    if (loggedUser.role === 'DELIVERYMAN') {
      throw new UnauthorizedException('You are not allowed.')
    }

    next()
  }
}
