import { Logger } from '@nestjs/common';

export class DevLogger extends Logger {
  private readonly shouldLog = process.env.NODE_ENV !== 'production';

  log(message: string) {
    if (this.shouldLog) super.log(message);
  }

  error(message: string) {
    if (this.shouldLog) super.error(message);
  }

  warn(message: string) {
    if (this.shouldLog) super.warn(message);
  }

  debug(message: string) {
    if (this.shouldLog) super.debug(message);
  }

  verbose(message: string) {
    if (this.shouldLog) super.verbose(message);
  }
}
