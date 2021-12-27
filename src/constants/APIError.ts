class APIError<
  TMessage extends string,
  TCode extends number = number,
> extends Error {
  public statusCode: number;
  constructor(message: TMessage, statusCode: TCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default APIError;
