import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/jwt/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createDoctor(
    @Body() createDoctorDto: CreateUserDto,
  ): Promise<{ accessToken: string; user: User }> {
    return await this.authService.registerUser(createDoctorDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    const jwtAndUser = this.authService.generateJwtToken(user);
    return jwtAndUser;
  }
}
