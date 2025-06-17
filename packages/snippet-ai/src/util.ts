export class InternalError extends Error {
  constructor(msg: string) {
    super(
      `Internal error: ${msg}. This is a bug, please report it to the maintainers`
    );
    this.name = 'InternalError';
  }
}
