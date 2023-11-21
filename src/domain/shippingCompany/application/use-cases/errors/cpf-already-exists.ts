import { UseCaseError } from '@/core/errors/use-case-error'

export class CpfAlreadyExists extends Error implements UseCaseError {
  constructor(cpf: string) {
    super(`Cpf number "${cpf}" already registered.`)
  }
}
