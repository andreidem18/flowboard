import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { useLogoutMutation } from "~/features/auth/mutations";
import { useTheme } from "~/providers/ThemeProvider";

export default function Home() {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { mutate } = useLogoutMutation({
    onSuccess: () => navigate("/auth"),
  });

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button
            className="mt-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            Button
          </Button>
          <Button className="mt-2" onClick={() => mutate()}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
