import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (message: string) => SetMetadata('message', message);
