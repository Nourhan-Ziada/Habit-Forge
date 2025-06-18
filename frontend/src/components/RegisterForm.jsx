import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateAuthFormat } from "../lib/validateAuthFormat";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function RegisterForm({ className, ...props }) {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setServerError("");
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const { valid, errors } = validateAuthFormat(formData);
    if (!valid) {
      setErrors((prev) => ({
        ...prev,
        ...errors.reduce((acc, { field, message }) => {
          acc[field] = message;
          return acc;
        }, {}),
      }));
      setServerError("Please fix the errors in the form.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
      });

      if (!response.success) {
        setServerError(response.error || "Registration failed.");
        setIsLoading(false);
        return;
      }

      navigate("/login"); //
    } catch (err) {
      console.error("Registration error:", err);
      setServerError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className={cn("w-full max-w-md", className)} {...props}>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-muted-foreground">
                Register to start using Habit Forge
              </p>
            </div>

            {serverError && (
              <div className="text-sm text-red-500 text-center">
                {serverError}
              </div>
            )}

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
