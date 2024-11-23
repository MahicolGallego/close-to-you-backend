import { ContactType } from 'src/common/constants/contact-type.enum';
import { Location } from 'src/locations/entities/location.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true, default: null })
  email: string;

  @Column({
    type: 'enum',
    enum: ContactType,
    nullable: false,
  })
  type: ContactType;

  @Column({ nullable: true, default: null })
  photo: string;

  @Column()
  id_user: string;

  @ManyToOne(() => User, (user) => user.contacts, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @OneToOne(() => Location, (location) => location.contact, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  location: Location;
}
