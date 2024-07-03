"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { useForm } from "react-hook-form";


import { z } from "zod";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

import { useTransition } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { createUser } from "@/actions/create-user";
import { toast } from "sonner";


const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type FormSchema = z.infer<typeof formSchema>;

const Home = () => {

  const { data } = useSession()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormSchema) {
    try {
      await createUser(data)
      toast.success('User created successfully')
      form.reset()
    } catch (err) {
      console.error(err)
      toast.error('Occurred error when create user')
    }
  }

  return (
    <div className="container py-5 space-y-5">
      <Card>
        <CardContent className="flex justify-between p-5 items-center">
          <h1>Home</h1>

          {!data?.user ? (
            <Button className="gap-x-2" onClick={() => signIn()}>
              <LogInIcon />
              Sign in
            </Button>
          ):(
            <div className="flex gap-5" >
              <Avatar>
                <AvatarImage src={data.user.image || ""} alt={data.user.name || ""}/>
              </Avatar>

              <Button className="gap-x-2" onClick={() => signOut()}>
                <LogOutIcon />
                Sign out
              </Button>
            </div>
          )}

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create user</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="E-mail" type="email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password (min 8 characters)"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;