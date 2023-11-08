import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidAttachment extends Error implements UseCaseError {
  constructor() {
    super('Invalid attachment.')
  }
}
