import { Administrator } from '../../enterprise/entities/administrator'
import { AdministratorsRepository } from '../repositories/administrators-repository'

interface LoginAdministratorUseCaseRequest {
  cpf: string
  password: string
}

interface LoginAdministratorUseCaseResponse {
  administrator: Administrator
}

export class LoginAdministratorUseCase {
  constructor(private administratorsRepository: AdministratorsRepository) {}

  async execute({
    cpf,
    password,
  }: LoginAdministratorUseCaseRequest): Promise<LoginAdministratorUseCaseResponse> {
    const administrator = await this.administratorsRepository.findByCpf(cpf)

    if (!administrator) {
      throw new Error('Cpf and/or password invalid.')
    }

    if (administrator.password !== password) {
      throw new Error('Cpf and/or password invalid.')
    }

    return {
      administrator,
    }
  }
}
