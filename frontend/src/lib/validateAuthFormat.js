import authShema from "../shemas/authShema";

export function validateAuthFormat(data) {
  const result =  authShema.safeParse(data);
  if (!result.success) {
   const errors = result.error.errors.map((error) => ({
      field: error.path[0],
      message: error.message,
    }));
    return { valid: false, errors };
  }
  return { valid: true };
}
