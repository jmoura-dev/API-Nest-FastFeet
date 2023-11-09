import { Administrator } from '../../enterprise/entities/administrator'

export abstract class AdministratorsRepository {
  abstract create(administrator: Administrator): Promise<void>
  abstract findById(id: string): Promise<Administrator | null>
  abstract findByCpf(cpf: string): Promise<Administrator | null>
  abstract save(administrator: Administrator): Promise<void>
}
