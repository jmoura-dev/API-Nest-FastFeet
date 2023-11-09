import { Deliveryman } from '../../enterprise/entities/deliveryman'

export abstract class DeliverymansRepository {
  abstract create(deliveryman: Deliveryman): Promise<void>
  abstract findById(id: string): Promise<Deliveryman | null>
  abstract findByCpf(cpf: string): Promise<Deliveryman | null>
  abstract save(deliveryman: Deliveryman): Promise<void>
}
