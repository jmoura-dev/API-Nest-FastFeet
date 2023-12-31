import { Order } from '@/domain/shippingCompany/enterprise/entities/order'

export class OrderPresenter {
  static toHttp(order: Order) {
    return {
      deliverymanId: order.deliverymanId?.toString(),
      recipientId: order.recipientId.toString(),
      title: order.title,
      status: order.status,
      attachment: order.attachment,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
