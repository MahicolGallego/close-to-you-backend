import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ErrorManager } from '../exception-filters/error-manager.filter';

export async function hashPassword(
  password: string,
  configService: ConfigService,
): Promise<string> {
  try {
    const salt_rounds_str = configService.get<string>('HASH_SALT');

    if (!salt_rounds_str)
      throw new ErrorManager({
        type: 'CONFLICT',
        message: 'Salt rounds no set',
      });

    const salt_rounds = parseInt(salt_rounds_str, 10);

    if (isNaN(salt_rounds))
      throw new ErrorManager({
        type: 'CONFLICT',
        message: 'Invalid salt rounds configuration',
      });

    const hashPassword = await bcrypt.hash(password, salt_rounds);

    return hashPassword;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? ErrorManager.createSignatureError(error.message)
      : error;
  }
}
