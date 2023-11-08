import { Either, left, right } from '@/core/either'
import { Administrator } from '../../enterprise/entities/administrator'
import { AdministratorsRepository } from '../repositories/administrators-repository'
import { CredentialsDoNotMatch } from '@/core/errors/errors/credentials-do-not-match'

interface LoginAdministratorUseCaseRequest {
  cpf: string
  password: string
}

type LoginAdministratorUseCaseResponse = Either<
  CredentialsDoNotMatch,
  {
    administrator: Administrator
  }
>

export class LoginAdministratorUseCase {
  constructor(private administratorsRepository: AdministratorsRepository) {}

  async execute({
    cpf,
    password,
  }: LoginAdministratorUseCaseRequest): Promise<LoginAdministratorUseCaseResponse> {
    const administrator = await this.administratorsRepository.findByCpf(cpf)

    if (!administrator) {
      return left(new CredentialsDoNotMatch())
    }

    if (administrator.password !== password) {
      return left(new CredentialsDoNotMatch())
    }

    return right({
      administrator,
    })
  }
}
