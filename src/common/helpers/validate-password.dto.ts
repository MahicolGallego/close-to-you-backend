import * as bcrypt from 'bcrypt';
import { ErrorManager } from '../exception-filters/error-manager.filter';

export async function validatePassword(
  originalPassword: string,
  passwordToValidate: string,
) {
  try {
    if (!(await bcrypt.compare(passwordToValidate, originalPassword)))
      throw new ErrorManager({
        type: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });

    return;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? ErrorManager.createSignatureError(error.message)
      : error;
  }
}
