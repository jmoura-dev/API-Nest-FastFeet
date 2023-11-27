import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ChangeStatusEvent } from '../events/change-status-events'

export interface OrderProps {
  deliverymanId?: UniqueEntityID | null
  recipientId: UniqueEntityID
  title: string
  status: string
  attachment: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get deliverymanId() {
    return this.props.deliverymanId
  }

  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
    this.touch()

    this.addDomainEvent(new ChangeStatusEvent(this))
  }

  get attachment() {
    return this.props.attachment
  }

  set attachment(attachment: string | null) {
    this.props.attachment = attachment
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'attachment'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        attachment: props.attachment ?? null,
      },
      id,
    )

    return order
  }
}
