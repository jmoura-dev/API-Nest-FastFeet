import { UseCaseError } from '@/core/errors/use-case-error'

export class NotAllowed extends Error implements UseCaseError {
  constructor() {
    super('Not Allowed!')
  }
}
