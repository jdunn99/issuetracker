export type FieldError = {
  /**
   * The error message
   */
  message: string;

  /**
   * Indicates the field which caused the error, if any
   * Acts as a path to the error
   *
   * Ex: ["accounts", "2", "email"]
   */
  field: string[];
};

export type DataWithError<T> = {
  data: T | null;
  error: FieldError | null;
};

export type PageInfo = {
  endCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type Connection<T> = {
  edges: T[];
  pageInfo: PageInfo;
};

export type Edge<T> = {
  cursor: string;
  node: T;
};

export type ConnectionArgs = {
  first: number;
  after: string;
};
