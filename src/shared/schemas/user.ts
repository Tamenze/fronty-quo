import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d].+$/;

//have i tested that this flow requires all fields?
const baseUserSchema = z.object({
  username: z.string().min(3, "A username of at least 3 characters is required"),
  email: z.email("Must be a valid email"),
  password: z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(PASSWORD_REGEX, "Must contain at least one number and one letter"),
})

export const createUserSchema = baseUserSchema.extend({
  password_confirmation: z.string().min(8, "Password must be at least 8 characters"),
}).refine(
    (data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"] // determines field on which the error gets surfaced
  })

export const loginUserSchema = baseUserSchema.omit({ username: true});


export const updateUserSchema = z.object({
  username: z.string().min(3, "Username must be least 3 characters").optional(),
  current_password: z.string().optional(),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
}).superRefine(
    (data, ctx) => {
      const current = data.current_password?.trim() || undefined;
      const pwd = data.password?.trim() || undefined;
      const confirm = data.password_confirmation?.trim() || undefined;

      if (!pwd) {
        return;
      }

      if (!current) {
        ctx.addIssue({
          code: "custom",
          message: "Current password is required",
          path: ["current_password"],
        });
      }
      if (pwd.length < 8) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password must be at least 8 characters",
        });
      }
      if (!PASSWORD_REGEX.test(pwd)) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Must contain at least one number and one letter",
        });
      }
      if (!confirm) {
        ctx.addIssue({
          code: "custom",
          message: "Please confirm the new password",
          path: ["password_confirmation"],
        });
      }
      if (confirm && pwd !== confirm) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords do not match",
          path: ["password_confirmation"],
        });
      }
      
    }
);


export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
