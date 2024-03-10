"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { login } from "@/server/actions/create-user";
import { useToast } from "../ui/use-toast";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
const formSchema = z.object({
    username: z.string().min(2, {
            message: "El usuario al menos tiene que tener 2 letras como mínimo",
        })
        .max(50, {
            message: "El usuario al menos tiene que tener 50 letras como máximo",
        }),
    password: z.string(),
});

export function Login() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const isLogged = await login(values)
        if (isLogged) {
            window.location.reload();
        } else {
            toast({
                description: "Las credenciales introducidas no son correctas 😓",
                variant: "destructive",
            });
        }    }
    return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Usuario</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Este será tu nombre de usuario para acceder.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>

                                <FormMessage />
                                <FormDescription>
                                    Este será tu clave de acceso.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Entrar</Button>
                </form>

            </Form>
    );
}
