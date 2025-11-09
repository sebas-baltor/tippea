export class HttpException extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}


export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500);
  }
}
