import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { CpfAlreadyExists } from './errors/cpf-already-exists'
import { HashGenerator } from '../cryptography/hash-generator'
import { AdministratorsRepository } from '../repositories/administrators-repository'
import { Administrator } from '../../enterprise/entities/administrator'

interface CreateAccountUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateAccountUseCaseResponse = Either<CpfAlreadyExists, null>

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private accountsRepository: AdministratorsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const checkedUserSameCpf = await this.accountsRepository.findByCpf(cpf)

    if (checkedUserSameCpf) {
      return left(new CpfAlreadyExists(cpf))
    }

    console.log('password', password)

    const hashedPassword = await this.hashGenerator.hash(password)

    console.log('hashedPassword', hashedPassword)

    const newAccountData = Administrator.create({
      name,
      cpf,
      password: hashedPassword,
    })

    await this.accountsRepository.create(newAccountData)

    return right(null)
  }
}
