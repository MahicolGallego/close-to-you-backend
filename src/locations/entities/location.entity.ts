import { Transform } from 'class-transformer';
import { Contact } from 'src/contacts/entities/contact.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contact_location')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Transform(({ value }) => parseFloat(value))
  @Column('decimal', { precision: 11, scale: 8 })
  latitude: number;

  @Transform(({ value }) => parseFloat(value))
  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column({ nullable: true })
  id_contact: string;

  @OneToOne(() => Contact, (contact) => contact.location, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_contact' })
  contact: Contact;
}
