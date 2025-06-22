import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // ValidationError and set error valid structure
  if (err instanceof mongoose.Error.ValidationError) {
    const simplifiedErrors: Record<string, any> = {};

    for (const field in err.errors) {
      const fieldError = err.errors[field];

      if (fieldError instanceof mongoose.Error.ValidatorError) {
        const props = fieldError.properties as Record<string, any>;
        simplifiedErrors[field] = {
          message: fieldError.message,
          name: fieldError.name,
          properties: {
            message: props?.message,
            type: props?.type,
            min: props?.min,
            max: props?.max,
          },
          kind: fieldError.kind,
          path: fieldError.path,
          value: fieldError.value,
        };
      }
    }

    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: err.name,
        errors: simplifiedErrors,
      },
    });
    return;
  }

  //send error if id is not valid
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      message: "Invalid ID format",
      success: false,
      error: {
        name: err.name,
        value: err.value,
        reason: "Id must be a 24-character hexadecimal string.",
        message: err.message,
      },
    });
    return;
  }

  // Default error handler for other error
  res.status(500).json({
    message: "Something went wrong",
    success: false,
    error: {
      name: err.name || "Error",
      message: err.message || "Unknown error",
    },
  });
};
