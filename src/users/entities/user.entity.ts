import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Roles } from 'src/common/constants/roles.enum';
import { Contact } from 'src/contacts/entities/contact.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  // Define properties of format responses with users for swagger documentation with @ApiProperty decorator
  @ApiProperty()
  // Expose properties for serialization. It will be included in the response when converting the entity to JSON.
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', unique: true, length: 30, nullable: false })
  email: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @ApiProperty()
  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  // Exclude properties from serialization. It will not be included in the response when converting the entity to JSON.
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  // relationship
  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];
}
