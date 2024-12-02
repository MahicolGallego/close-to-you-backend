import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { ErrorManager } from 'src/common/exception-filters/error-manager.filter';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    try {
      const newLocation = this.locationsRepository.create(createLocationDto);
      const registeredLocation =
        await this.locationsRepository.save(newLocation);

      if (!registeredLocation)
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'Database error: Cannot register location',
        });

      return registeredLocation;
    } catch (error) {
      console.error(error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : error;
    }
  }

  async update(id: string, newlocation: UpdateLocationDto): Promise<Location> {
    try {
      const updatedLocation = await this.locationsRepository.update(id, {
        latitude: newlocation.latitude,
        longitude: newlocation.longitude,
      });

      if (!updatedLocation.affected)
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'Database error: Cannot update location',
        });

      // Recovery the updated location
      const location = await this.locationsRepository.findOne({
        where: { id },
      });

      return location;
    } catch (error) {
      console.error(error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.locationsRepository.delete({ id });

      if (!result.affected) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message:
            'Database error: Cannot delete contact. the location of contact not exist',
        });
      }
    } catch (error) {
      console.error(error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : error;
    }
  }
}
