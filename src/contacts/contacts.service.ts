import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { LocationsService } from 'src/locations/locations.service';
import { ErrorManager } from 'src/common/exception-filters/error-manager.filter';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
    private readonly usersService: UsersService,
    private readonly locationsService: LocationsService,
  ) {}

  async create(
    id_user: string,
    createContactDto: CreateContactDto,
  ): Promise<Contact> {
    try {
      const user = await this.usersService.findById(id_user);

      if (!user)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User that attemp add a new contact not found',
        });

      const newContact = this.contactsRepository.create({
        name: createContactDto.name,
        phone: createContactDto.phone,
        type: createContactDto.type,
        user,
      });

      if (createContactDto.email) newContact.email = createContactDto.email;
      if (createContactDto.photo) newContact.photo = createContactDto.photo;

      const registeredContact = await this.contactsRepository.save(newContact);

      if (createContactDto.latitude && createContactDto.longitude) {
        await this.locationsService.create({
          latitude: createContactDto.latitude,
          longitude: createContactDto.longitude,
          contact: registeredContact,
        });
      }

      return await this.contactsRepository.findOne({
        where: { id: registeredContact.id },
      });
    } catch (error) {
      console.error(error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : error;
    }
  }

  async update(
    id: string,
    id_user: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    try {
      const contact = await this.contactsRepository.findOne({
        where: { id, id_user },
      });

      if (!contact)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Contact to update not found',
        });

      if (updateContactDto.name) contact.name = updateContactDto.name;
      if (updateContactDto.email) contact.email = updateContactDto.email;
      if (updateContactDto.type) contact.type = updateContactDto.type;
      if (updateContactDto.photo) contact.photo = updateContactDto.photo;
      if (updateContactDto.phone) contact.phone = updateContactDto.phone;

      if (updateContactDto.latitude && updateContactDto.longitude) {
        if (contact.location) {
          contact.location.latitude = updateContactDto.latitude;
          contact.location.longitude = updateContactDto.longitude;

          await this.locationsService.update(
            contact.location.id,
            contact.location,
          );
        } else {
          // if the contact does not have a location yet, create a new one
          await this.locationsService.create({
            latitude: updateContactDto.latitude,
            longitude: updateContactDto.longitude,
            contact,
          });
        }
      }

      // The properties are extracted ignoring the location because typeorm identifies that
      // the entity does not have the relationship with location and when it wants to update
      // it throws an error for the location properties
      const { name, email, type, phone, photo, user } = contact;

      const result = await this.contactsRepository.update(id, {
        id,
        name,
        email,
        type,
        phone,
        photo,
        id_user,
        user,
      });

      if (!result.affected)
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'Database error: Cannot update contact',
        });

      return contact;
    } catch (error) {
      console.error(error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : error;
    }
  }

  async findAll(id_user: string): Promise<Contact[]> {
    const contacts = await this.contactsRepository.find({
      where: { id_user },
    });

    return contacts.length ? contacts : [];
  }

  async findOne(id: string, id_user: string): Promise<Contact> {
    try {
      const contact = await this.contactsRepository.findOne({
        where: { id, id_user },
      });

      if (!contact)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Contact not found',
        });

      return contact;
    } catch (error) {
      console.error(error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : error;
    }
  }

  async remove(id: string, id_user: string): Promise<{ message: string }> {
    try {
      const result = await this.contactsRepository.delete({ id, id_user });

      if (!result.affected) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message:
            'Database error: Cannot delete contact. the contact not exist',
        });
      }

      return { message: 'Contact deleted successfully' };
    } catch (error) {
      console.error(error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : error;
    }
  }
}
