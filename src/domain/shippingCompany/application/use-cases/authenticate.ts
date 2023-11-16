import { Either, left, right } from '@/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { AdministratorsRepository } from '../repositories/administrators-repository'
import { CredentialsDoNotMatch } from '@/core/errors/errors/credentials-do-not-match'

interface AuthenticateUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  CredentialsDoNotMatch,
  {
    accessToken: string
  }
>

export class AuthenticateUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const administrator = await this.administratorsRepository.findByCpf(cpf)

    if (!administrator) {
      return left(new CredentialsDoNotMatch())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      administrator.password,
    )

    if (!isPasswordValid) {
      return left(new CredentialsDoNotMatch())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: administrator.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
