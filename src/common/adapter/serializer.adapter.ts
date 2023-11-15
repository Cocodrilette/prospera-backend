export class Serializer {
  get env() {
    function parseArray(value: string): string[] {
      return value.split(',');
    }

    return { parseArray };
  }
}
