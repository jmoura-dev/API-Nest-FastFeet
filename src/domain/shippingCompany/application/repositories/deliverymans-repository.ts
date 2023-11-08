import { Deliveryman } from '../../enterprise/entities/deliveryman'

export interface DeliverymansRepository {
  create(deliveryman: Deliveryman): Promise<void>
  findById(id: string): Promise<Deliveryman | null>
  findByCpf(cpf: string): Promise<Deliveryman | null>
  save(deliveryman: Deliveryman): Promise<void>
}
