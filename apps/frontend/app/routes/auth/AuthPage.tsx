import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { LoginForm, SignUpForm } from "~/features/auth/components"

export default function AuthPage() {
  return (
    <div className="flex size-full min-h-dvh items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl text-transparent">
            FlowBoard
          </CardTitle>
          <CardDescription>
            Manage your tasks and projects efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
