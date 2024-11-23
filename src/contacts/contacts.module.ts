import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LocationsModule } from 'src/locations/locations.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    AuthModule,
    LocationsModule,
    UsersModule,
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
