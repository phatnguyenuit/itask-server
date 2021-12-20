class APIError<TMessage extends string> extends Error {
  public statusCode: number;
  constructor(message: TMessage, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default APIError;
