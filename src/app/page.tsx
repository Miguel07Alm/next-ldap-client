'use client';
import Hero from "@/components/Hero";
import { Login } from "@/components/auth/Login";
import { SignUp } from "@/components/auth/Signup";
import ChangePasswordModal from "@/components/dashboard/ChangePasswordModal";
import Connections from "@/components/dashboard/Connections";
import Header from "@/components/dashboard/Header";
import Navbar from "@/components/dashboard/Navbar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { isCookieValid } from "./actions";



export default  function Home() {
    const [isLogged, setIsLogged] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const checkLogin = async() => {
            const username = await isCookieValid()
            if(!username) return;
            setIsLogged(true)
            setUsername(username)
        }
        checkLogin();
    }, [])
  return (
      <main className="m-4 space-y-4 ">
          {!isLogged && (
              <>
                  <Hero />
                  <Tabs
                      defaultValue="signup"
                      className="w-[35dvh] mx-auto  bg-white shadow-lg rounded-md p-3"
                  >
                      <TabsList className="grid w-full grid-cols-2 mb-3">
                          <TabsTrigger value="signup">Registro</TabsTrigger>
                          <TabsTrigger value="login">
                              Iniciar sesión
                          </TabsTrigger>
                      </TabsList>
                      <TabsContent value="signup">
                          <SignUp />
                      </TabsContent>
                      <TabsContent value="login">
                          <Login />
                      </TabsContent>
                  </Tabs>
              </>
          )}
          {isLogged && (
              <main className="flex flex-col justify-center items-center">
                  <section>
                      <Navbar />
                  </section>

                  <Header username={username} />
                  <div className="space-y-4">
                      <Connections classname="w-full"/>
                      <ChangePasswordModal username={username}/>
                  </div>
              </main>
          )}
      </main>
  );
}
