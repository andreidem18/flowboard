import { ErrorHandler } from "elysia";

export const errorHandler: ErrorHandler = ({
  code,
  error,
  set,
}) => {

  switch (code) {
    case "NOT_FOUND":
      set.status = 404;

      return {
        message: error.message,
      };

    case "VALIDATION":
      set.status = 400;

      return {
        message: "Validation error",
        errors: "all" in error ? error.all : [],
      };

    default:
      console.error(error);

      set.status = 500;

      return {
        message: "Internal server error",
      };
  }
};
