import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { validateAuthFormat } from "../lib/validateAuthFormat";
import { useNavigate } from "react-router-dom";
import organizeHabitsImg from "../assets/images/organizeHabits.png";

<img
  src={organizeHabitsImg}
  alt="Image"
  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
/>
export function LoginForm({ className, ...props }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setErrors({});
    setServerError("");
    const {
      valid,
      errors
    } = validateAuthFormat(formData);
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
      const response = await login({
        email: formData.email,
        password: formData.password,
      });
      if (!response.success) {
        // Handle login failure
        setServerError(response.error || "Login failed. Please try again.");
        setErrors({});
        setIsLoading(false);
        return;
      }
      navigate("/dashboard");
      console.log("Login successful:", response);
    } catch (err) {
      console.error("Login error:", err);
      setServerError("An unexpected error occurred. Please try again later.");
      setErrors({});
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Habit Forge account
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
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
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-sm text-muted-foreground text-center">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-primary hover:underline"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={organizeHabitsImg}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
