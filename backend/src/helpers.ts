export function isRunningTest() {
  /* istanbul ignore next */
  return process.env.JEST_WORKER_ID !== undefined;
}

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import CustomValidationError from './features/core/custom-validation-error';
import { NotFoundError } from './features/core/found-found-error';

const samplePrismaNotFoundError = new PrismaClientKnownRequestError(
  'Not Found',
  { code: 'P2025' } as any,
);

const sampleCustomValidationError = new CustomValidationError('', '');

const sampleNotFoundError = new NotFoundError();

export {
  samplePrismaNotFoundError,
  sampleCustomValidationError,
  sampleNotFoundError,
};
