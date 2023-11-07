// import {
//   Body,
//   ConflictException,
//   Controller,
//   HttpCode,
//   Post,
//   UsePipes,
// } from '@nestjs/common'
// import { hash } from 'bcryptjs'
// import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
// import { PrismaService } from 'src/prisma/prisma.service'
// import { z } from 'zod'

// const createRecipientBodySchema = z.object({
//   name: z.string(),
//   email: z.string().email(),
//   password: z.string().min(6),
//   city: z.string(),
//   neighborhood: z.string(),
//   houseNumber: z.number(),
//   latitude: z.number(),
//   longitude: z.number(),
// })

// type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

// @Controller('/recipients')
// export class CreateRecipientsController {
//   constructor(private prisma: PrismaService) {}

//   @Post()
//   @HttpCode(201)
//   @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
//   async create(@Body() body: CreateRecipientBodySchema) {
//     const {
//       name,
//       email,
//       password,
//       city,
//       neighborhood,
//       houseNumber,
//       latitude,
//       longitude,
//     } = body

//     const checkedUserSameEmail = await this.prisma.recipient.findUnique({
//       where: {
//         email,
//       },
//     })

//     if (checkedUserSameEmail) {
//       throw new ConflictException('User already exists with this cpf')
//     }

//     const hashedPassword = await hash(password, 8)

//     await this.prisma.recipient.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,

//       },
//     })
//   }
// }
