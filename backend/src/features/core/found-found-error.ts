import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'Not found');
  }
}

export function isNotFoundError(err: unknown) {
  return err instanceof PrismaClientKnownRequestError && err.code === 'P2025';
}
