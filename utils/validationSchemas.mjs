export const createUserValidationSchema = {
  username: {
    isLength: {
      options: { min: 3, max: 10 },
      errorMessage: "Must be at least 3 and at most 10 characters long",
    },
    notEmpty: {
      errorMessage: "Username is required",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  name: {
    notEmpty: {
      errorMessage: "Display name is required",
    },
    isString: {
      errorMessage: "Display name must be a string",
    },
  },
};

export const getUsersValidationSchema = {
  filter: {
    notEmpty: {
      errorMessage: "Filter is required",
    },
    isString: {
      errorMessage: "Filter must be a string",
    },
    isLength: {
      options: { min: 3, max: 10 },
      errorMessage: "Must be at least 3 and at most 10 characters long",
    },
  },
};
