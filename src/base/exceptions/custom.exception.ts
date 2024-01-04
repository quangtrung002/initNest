import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

export class CustomException extends HttpException {
  constructor(
    message: string,
    success: boolean = false,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    super({ success, message }, statusCode);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not found') {
    super({ success: false, message }, HttpStatusCode.NotFound);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad Request') {
    super({ success: false, message }, HttpStatusCode.BadRequest);
  }
}

export class SuccessException extends HttpException {
  constructor(message: string = 'Successfully') {
    super({ success: true, message }, HttpStatusCode.Ok);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict') {
    super({ success: false, message }, HttpStatusCode.Conflict);
  }
}
