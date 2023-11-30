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