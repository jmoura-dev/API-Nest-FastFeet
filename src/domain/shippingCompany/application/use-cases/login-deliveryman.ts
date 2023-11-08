import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymansRepository } from '../repositories/deliverymans-repository'

interface LoginDeliverymanUseCaseRequest {
  cpf: string
  password: string
}

interface LoginDeliverymanUseCaseResponse {
  deliveryman: Deliveryman
}

export class LoginDeliverymanUseCase {
  constructor(private deliverymansRepository: DeliverymansRepository) {}

  async execute({
    cpf,
    password,
  }: LoginDeliverymanUseCaseRequest): Promise<LoginDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymansRepository.findByCpf(cpf)

    if (!deliveryman) {
      throw new Error('Cpf and/or password invalid.')
    }

    if (deliveryman.password !== password) {
      throw new Error('Cpf and/or password invalid.')
    }

    return {
      deliveryman,
    }
  }
}
