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
import { AttachmentFactory } from 'test/factories/make-attachment'

describe('Mark order as delivered (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory
  let administratorFactory: AdministratorFactory
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        OrderFactory,
        AdministratorFactory,
        RecipientFactory,
        AttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    administratorFactory = moduleRef.get(AdministratorFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[PUT] /orders/:orderId/:deliverymanId/delivered', async () => {
    const user = await administratorFactory.makePrismaAdministrator()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()
    const attachment = await attachmentFactory.makePrismaAttachment()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: user.id,
      status: 'Aguardando retirada',
      title: 'Aguardando retirada',
    })

    const orderId = order.id.toString()
    const deliverymanId = user.id.toString()
    const attachmentId = attachment.id.toString()

    const result = await request(app.getHttpServer())
      .put(`/orders/${orderId}/${deliverymanId}/delivered`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentId,
      })

    expect(result.statusCode).toBe(200)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    expect(orderOnDatabase).toBeTruthy()
    expect(orderOnDatabase).toEqual(
      expect.objectContaining({
        title: 'Pedido entregue.',
        status: 'Pedido entregue com sucesso!',
        attachmentId,
      }),
    )
  })
})
