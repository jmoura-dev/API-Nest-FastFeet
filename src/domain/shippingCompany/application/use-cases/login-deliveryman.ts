import { Either, left, right } from '@/core/either'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymansRepository } from '../repositories/deliverymans-repository'
import { CredentialsDoNotMatch } from '@/core/errors/errors/credentials-do-not-match'

interface LoginDeliverymanUseCaseRequest {
  cpf: string
  password: string
}

type LoginDeliverymanUseCaseResponse = Either<
  CredentialsDoNotMatch,
  {
    deliveryman: Deliveryman
  }
>

export class LoginDeliverymanUseCase {
  constructor(private deliverymansRepository: DeliverymansRepository) {}

  async execute({
    cpf,
    password,
  }: LoginDeliverymanUseCaseRequest): Promise<LoginDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymansRepository.findByCpf(cpf)

    if (!deliveryman) {
      return left(new CredentialsDoNotMatch())
    }

    if (deliveryman.password !== password) {
      return left(new CredentialsDoNotMatch())
    }

    return right({
      deliveryman,
    })
  }
}
