//ChatGPT helped me generate this code. I used the prompt: How does the error.tsx file work in nextjs? Can I put that at the root of all of my folders, and when there is an error, will the error file render with the error information? How does it know what information the error has? Should I make my own classes that extend errors in nextjs to give it that information?

export class CustomError extends Error {
  statusCode: number;
  additionalInfo: string;

  constructor(message: string, statusCode: number, additionalInfo: string) {
    super(message);
    this.statusCode = statusCode;
    this.additionalInfo = additionalInfo;
  }
}

export const AUTHENTICATION_ERROR_MESSAGE =
  "You must be logged in to access this";
