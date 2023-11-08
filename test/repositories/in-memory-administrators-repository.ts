import { AdministratorsRepository } from '@/domain/shippingCompany/application/repositories/administrators-repository'
import { Administrator } from '@/domain/shippingCompany/enterprise/entities/administrator'

export class InMemoryAdministratorsRepository
  implements AdministratorsRepository
{
  public items: Administrator[] = []

  async create(administrator: Administrator) {
    this.items.push(administrator)
  }

  async findById(id: string) {
    const administrator = this.items.find(
      (administrator) => administrator.id.toString() === id,
    )

    if (!administrator) {
      return null
    }

    return administrator
  }

  async findByCpf(cpf: string) {
    const administrator = this.items.find(
      (administrator) => administrator.cpf === cpf,
    )

    if (!administrator) {
      return null
    }

    return administrator
  }

  async save(administrator: Administrator) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === administrator.id,
    )

    this.items[itemIndex] = administrator
  }
}
