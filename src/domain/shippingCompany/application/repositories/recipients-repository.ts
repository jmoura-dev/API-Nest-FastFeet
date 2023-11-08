import { Recipient } from '../../enterprise/entities/recipient'

export interface RecipientsRepository {
  create(recipient: Recipient): Promise<void>
  findById(id: string): Promise<Recipient | null>
  findByEmail(email: string): Promise<Recipient | null>
  save(recipient: Recipient): Promise<void>
}
