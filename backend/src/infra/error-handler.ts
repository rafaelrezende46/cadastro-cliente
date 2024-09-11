import { isRunningTest } from '../helpers';
import CustomValidationError from '../features/core/custom-validation-error';
import { ValidationError } from 'joi';
import { NotFoundError } from '../features/core/found-found-error';

const errorHandler = (err: any, req: any, res: any, next: any) => { // eslint-disable-line
  if (err instanceof ValidationError) {
    const errors = err.details.map(p => ({
      field: p.path[p.path.length - 1].toString(),
      message: p.message,
    }));

    res.status(400).json({ errors });
    return;
  }

  if (err instanceof CustomValidationError) {
    const errors = [
      {
        field: err.field,
        message: err.message,
      },
    ];

    res.status(400).json({ errors });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).end();
    return;
  }

  /* istanbul ignore next */
  if (!isRunningTest()) {
    console.error(err.stack);
  }

  res.status(500).end();
};

export default errorHandler;
