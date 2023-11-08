import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from './order'

export interface DeliverymanProps {
  name: string
  cpf: string
  password: string
  orders: Order[]
}

export class Deliveryman extends Entity<DeliverymanProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  get orders() {
    return this.props.orders
  }

  set orders(orders: Order[]) {
    this.props.orders = orders
  }

  static create(props: DeliverymanProps, id?: UniqueEntityID) {
    const deliveryman = new Deliveryman(props, id)

    return deliveryman
  }
}
