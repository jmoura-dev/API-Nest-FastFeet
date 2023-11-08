import { UseCaseError } from '@/core/errors/use-case-error'

export class EmailAlreadyExists extends Error implements UseCaseError {
  constructor() {
    super('E-mail already exists.')
  }
}
