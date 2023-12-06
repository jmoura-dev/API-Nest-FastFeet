### Application rules

- [x] The application must have two types of user, delivery person and/or admin
- [x] It must be possible to log in with CPF and Password
- [x] It must be possible to perform CRUD for delivery drivers
- [x] It must be possible to perform CRUD of orders
- [x] It must be possible to perform CRUD of recipients
- [x] It must be possible to mark an order as waiting (Available for pickup)
- [x] It must be possible to pick up an order
- [x] It must be possible to mark an order as delivered
- [x] It must be possible to mark an order as returned
- [x] It must be possible to list orders with delivery addresses close to the delivery person's location
- [x] It must be possible to change a user's password
- [x] It must be possible to list a user's deliveries
- [x] It must be possible to notify the recipient of each change in the order status

### Business rules

- [x] Only admin type users can perform CRUD operations on orders
- [x] Only admin type users can perform CRUD operations on delivery people
- [x] Only admin type user can perform CRUD operations on recipients
- [x] To mark an order as delivered, it is mandatory to send a photo
- [x] Only the delivery person who picked up the order can mark it as delivered
- [x] Only the admin can change a user's password
- [x] It must not be possible for a delivery person to list the orders of another delivery person

# Nest-Fast-Feet-API
Infrastructure layer using the domain-based(DDD) NestJS Framework..

### Techs:
- **Nodejs**, **Nestjs**, **Docker**, **Clean-Architecture**, **DDD(Domain-driven-design)**, **Supertest**, **Typescript**, **Zod**, **JWT-authenticate**, **Tests(Unit tests and E2E)**, **Middlewares**, **POO**, **DomainEvents**;

### Database:
**PrismaORM**, **Postgres**

## 📁 Project

- Creating an API to track deliveries based on the above technologies and rules;

## 💡 Functionalities

- Is it possible to create a new order;
- Is it possible changes status of order;
- There are two personas (delivery person/admin);
- Whenever the status changes, a notification is sent to the user;
- To complete a delivery, the deliveryperson needs to send a image;
- Integration with external service for uploading files(R2-Cloudflare);


## 👨🏽‍💻 To use
### Steps:
#### Important - (Check the environment variables according to your settings and preferences.);

- git clone https://github.com/jmoura-dev/API-Nest-FastFeet.git
- cd api-nest-fast-feet
- pnpm i
- pnpm run dev
