import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { OrderFactory } from 'test/factories/make-order'
import { DatabaseModule } from '@/infra/database/database.module'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { JwtService } from '@nestjs/jwt'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch nearby deliveries (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory
  let administratorFactory: AdministratorFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory, AdministratorFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    administratorFactory = moduleRef.get(AdministratorFactory)

    await app.init()
  })

  test('[GET] /orders/:deliverymanId', async () => {
    const user = await administratorFactory.makePrismaAdministrator()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient01 = await recipientFactory.makePrismaRecipient({
      name: 'recipient-01',
      latitude: -9.600089,
      longitude: -35.760181,
    })

    const recipient02 = await recipientFactory.makePrismaRecipient({
      name: 'recipient-02',
      latitude: -9.604483,
      longitude: -35.757885,
    })

    const deliverymanId = user.id.toString()

    await orderFactory.makePrismaOrder({
      recipientId: recipient01.id,
      deliverymanId: user.id,
      status: 'Pedido-01',
      title: 'Pedido-01',
    })

    await orderFactory.makePrismaOrder({
      recipientId: recipient02.id,
      deliverymanId: user.id,
      status: 'Pedido-02',
      title: 'Pedido-02',
    })

    await orderFactory.makePrismaOrder({
      recipientId: recipient01.id,
      deliverymanId: user.id,
      status: 'Pedido-03',
      title: 'Pedido-03',
    })

    const result = await request(app.getHttpServer())
      .get(`/orders/${deliverymanId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        latitude: -9.60044,
        longitude: -35.760576,
      })

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      orders: [
        expect.objectContaining({ status: 'Pedido-01', title: 'Pedido-01' }),
        expect.objectContaining({ status: 'Pedido-03', title: 'Pedido-03' }),
      ],
    })
  })
})
