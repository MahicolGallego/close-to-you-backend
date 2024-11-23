import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import validator from 'validator';
import { AuthService } from 'src/auth/auth.service';
import { ErrorManager } from 'src/common/exception-filters/error-manager.filter';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'localStrategy') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      //validate email
      if (!validator.isEmail(email.toLowerCase().trim()) || !password)
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });

      const user = await this.authService.validateUser({
        email: email.toLowerCase().trim(),
        password,
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : error;
    }
  }
}
