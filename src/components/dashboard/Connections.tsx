import { Button } from "../ui/button";
import Image from 'next/image';
import Link from "next/link";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { cn } from "@/lib/utils";
export default function Connections({
    classname
}: {
    classname: string;
}) {
    return (
        <Drawer>
            <DrawerTrigger className="flex justify-center items-center w-full">
                <Button variant="black" className="w-full">
                    👀 Ver conexiones
                </Button>
            </DrawerTrigger>
            <DrawerContent className="flex justify-center items-center">
                <DrawerHeader className="flex flex-col justify-center items-center">
                    <DrawerTitle className="text-2xl">
                        Prueba tus credenciales LDAP
                    </DrawerTitle>
                    <DrawerDescription>
                        Ingresa a uno de los servicios y comprueba tu acceso.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col space-y-4">
                    <Link
                        href={process.env.NEXT_PUBLIC_GITLAB_URL ?? ""}
                        target="_blank"
                    >
                        <Button variant="black" className="gap-3 w-full">
                            <Image
                                src="/gitlab.svg"
                                width={24}
                                height={24}
                                alt="GitLab Icon"
                            />
                            GitLab
                        </Button>
                    </Link>
                    <Link
                        href={process.env.NEXT_PUBLIC_JENKINS_URL ?? ""}
                        target="_blank"
                    >
                        <Button variant="black" className="gap-3 w-full">
                            <Image
                                src="/jenkins.svg"
                                width={24}
                                height={24}
                                alt="Jenkins Icon"
                            />
                            Jenkins
                        </Button>
                    </Link>
                    <Link
                        href={process.env.NEXT_PUBLIC_SONARQUBE_URL ?? ""}
                        target="_blank"
                    >
                        <Button variant="black" className="gap-3 w-full">
                            <Image
                                src="/sonarqube.svg"
                                width={24}
                                height={24}
                                alt="Sonarqube Icon"
                            />
                            Sonarqube
                        </Button>
                    </Link>
                </div>
                <DrawerFooter>
                    <DrawerClose>
                        <Button variant="outline">Salir</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}