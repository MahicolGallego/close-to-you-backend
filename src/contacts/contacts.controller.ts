import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { IPayloadToken } from 'src/common/interfaces/payload-token.interface';

@UseGuards(JwtAuthGuard)
@ApiTags('contacts')
@ApiBearerAuth()
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto, @Req() req: Request) {
    const user = req.user as IPayloadToken;
    return this.contactsService.create(user.sub, createContactDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as IPayloadToken;
    return this.contactsService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as IPayloadToken;
    return this.contactsService.findOne(id, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Req() req: Request,
  ) {
    const user = req.user as IPayloadToken;
    return this.contactsService.update(id, user.sub, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as IPayloadToken;
    return this.contactsService.remove(id, user.sub);
  }
}
