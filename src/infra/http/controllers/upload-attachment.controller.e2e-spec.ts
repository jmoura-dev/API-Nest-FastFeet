import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Upload attachment (E2E)', () => {
  let app: INestApplication
  let administratorFactory: AdministratorFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdministratorFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    administratorFactory = moduleRef.get(AdministratorFactory)

    await app.init()
  })

  test('[POST] /attachments', async () => {
    const user = await administratorFactory.makePrismaAdministrator()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const result = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/test-upload.png')

    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual({
      attachmentId: expect.any(String),
    })
  })
})
