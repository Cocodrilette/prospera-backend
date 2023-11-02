import * as bcrypt from 'bcrypt';

export class HashAdapter {
  constructor(private readonly saltRounds = 10) {}

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
