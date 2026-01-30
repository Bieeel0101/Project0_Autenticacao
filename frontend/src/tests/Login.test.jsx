import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../auth/Login";
import { AuthProvider } from "../auth/AuthContext";

test("login form basic", () => {
  render(
    <AuthProvider>
      <Login />
    </AuthProvider>,
  );
  const email = screen.getByPlaceholderText("Email");
  const pass = screen.getByPlaceholderText("Senha");
  fireEvent.change(email, { target: { value: "a@b.com" } });
  fireEvent.change(pass, { target: { value: "123456" } });
  expect(email.value).toBe("a@b.com");
  expect(pass.value).toBe("123456");
});
