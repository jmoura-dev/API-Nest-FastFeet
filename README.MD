### Application rules

- [] The application must have two types of user, delivery person and/or admin
- [] It must be possible to log in with CPF and Password
- [] It must be possible to perform CRUD for delivery drivers
- [] It must be possible to perform CRUD of orders
- [] It must be possible to perform CRUD of recipients
- [] It must be possible to mark an order as waiting (Available for pickup)
- [] It must be possible to pick up an order
- [] It must be possible to mark an order as delivered
- [] It must be possible to mark an order as returned
- [] It must be possible to list orders with delivery addresses close to the delivery person's location
- [] It must be possible to change a user's password
- [] It must be possible to list a user's deliveries
- [] It must be possible to notify the recipient of each change in the order status

### Business rules

- [] Only admin type users can perform CRUD operations on orders
- [] Only admin type users can perform CRUD operations on delivery people
- [] Only admin type user can perform CRUD operations on recipients
- [] To mark an order as delivered, it is mandatory to send a photo
- [] Only the delivery person who picked up the order can mark it as delivered
- [] Only the admin can change a user's password
- [] It must not be possible for a delivery person to list the orders of another delivery person