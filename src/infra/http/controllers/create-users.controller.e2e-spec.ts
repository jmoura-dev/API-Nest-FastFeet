import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create user (E2E)', () => {
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

  test('[POST] /users', async () => {
    const result = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      cpf: '23131253432',
      password: '123456',
    })

    expect(result.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '23131253432',
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase?.name).toEqual('John Doe')
  })
})
