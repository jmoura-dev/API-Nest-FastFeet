import { Administrator } from '../../enterprise/entities/administrator'

export interface AdministratorsRepository {
  create(administrator: Administrator): Promise<void>
  findById(id: string): Promise<Administrator | null>
  findByCpf(cpf: string): Promise<Administrator | null>
  save(administrator: Administrator): Promise<void>
}
