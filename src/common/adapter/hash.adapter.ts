import * as bcrypt from 'bcrypt';

export class HashAdapter {
  async hash(plainText: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plainText, saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
