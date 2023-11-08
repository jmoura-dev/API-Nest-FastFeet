import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'
import { Optional } from '@/core/types/optional'

export interface RecipientProps {
  name: string
  email: string
  password: string
  slug: Slug
  city: string
  neighborhood: string
  houseNumber: number
  latitude: number
  longitude: number
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get city() {
    return this.props.city
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood
    this.props.slug = Slug.createFromText(neighborhood)
  }

  get slug() {
    return this.props.slug
  }

  get houseNumber() {
    return this.props.houseNumber
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  static create(props: Optional<RecipientProps, 'slug'>, id?: UniqueEntityID) {
    const recipient = new Recipient(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.neighborhood),
      },
      id,
    )

    return recipient
  }
}
