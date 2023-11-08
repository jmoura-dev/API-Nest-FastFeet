import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { hash } from 'bcryptjs'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /users/sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        cpf: '23131253432',
        password: await hash('123456', 8),
      },
    })

    const result = await request(app.getHttpServer())
      .post('/users/sessions')
      .send({
        cpf: '23131253432',
        password: '123456',
      })

    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
