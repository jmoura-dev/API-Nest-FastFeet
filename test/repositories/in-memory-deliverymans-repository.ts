import { DeliverymansRepository } from '@/domain/shippingCompany/application/repositories/deliverymans-repository'
import { Deliveryman } from '@/domain/shippingCompany/enterprise/entities/deliveryman'

export class InMemoryDeliverymansRepository implements DeliverymansRepository {
  public items: Deliveryman[] = []

  async create(deliveryman: Deliveryman) {
    this.items.push(deliveryman)
  }

  async findById(id: string) {
    const deliveryman = this.items.find(
      (deliveryman) => deliveryman.id.toString() === id,
    )

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async findByCpf(cpf: string) {
    const deliveryman = this.items.find(
      (deliveryman) => deliveryman.cpf.toString() === cpf,
    )

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async save(deliveryman: Deliveryman) {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)

    this.items[itemIndex] = deliveryman
  }
}
