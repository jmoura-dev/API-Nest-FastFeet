import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { OrderFactory } from 'test/factories/make-order'
import { DatabaseModule } from '@/infra/database/database.module'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { JwtService } from '@nestjs/jwt'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch deliveries from deliveryman (E2E)', () => {
  let app: INestApplication
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliverymanFactory
  let administratorFactory: AdministratorFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        OrderFactory,
        AdministratorFactory,
        DeliverymanFactory,
        RecipientFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    administratorFactory = moduleRef.get(AdministratorFactory)

    await app.init()
  })

  test('[GET] /orders/:deliverymanId', async () => {
    const user = await administratorFactory.makePrismaAdministrator()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()
    const recipientId = recipient.id

    const deliveryman01 = await deliverymanFactory.makePrismaDeliveryman({
      name: 'deliveryman-01',
    })

    const deliveryman02 = await deliverymanFactory.makePrismaDeliveryman({
      name: 'deliveryman-02',
    })

    await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman01.id,
      recipientId,
      status: 'Pedido-01',
      title: 'Pedido-01',
    })

    await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman01.id,
      recipientId,
      status: 'Pedido-02',
      title: 'Pedido-02',
    })

    await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman02.id,
      recipientId,
      status: 'Pedido-03',
      title: 'Pedido-03',
    })

    const deliverymanId = deliveryman01.id.toString()

    const result = await request(app.getHttpServer())
      .get(`/orders/deliverymans/${deliverymanId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      orders: [
        expect.objectContaining({ status: 'Pedido-02', title: 'Pedido-02' }),
        expect.objectContaining({ status: 'Pedido-01', title: 'Pedido-01' }),
      ],
    })
  })
})
