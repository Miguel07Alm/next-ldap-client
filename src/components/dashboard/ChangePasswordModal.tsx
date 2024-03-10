import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { toast, useToast } from "../ui/use-toast";
import { changePassword } from "@/server/actions/create-user";
import IHeader from "@/interfaces/IHeader";
export default function ChangePasswordModal({username} : IHeader) {
    const [newPassword, setNewPassword] = useState("");
    const [retypeNewPassword, setRetypeNewPassword] = useState("")
    const { toast } = useToast();

    const handleSubmit = ()=> {
            if (newPassword !== retypeNewPassword) {
                toast({
                    description: "🔔 Las contraseñas no coinciden",
                    variant: "destructive",
                });
            } else {
                changePassword(username, newPassword).then((value) => {
                    if (value) window.location.reload();
                    else {
                        toast({
                            description: "🖥️ Algo ha ido mal...",
                            variant: "destructive",
                        });
                    }
                });
            }
                        
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="black">🔑 Cambiar contraseña</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cambiar contraseña</DialogTitle>
                    <DialogDescription>
                        Cambia tu clave de acceso para los servicios LDAP.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className=" items-center gap-4">
                        <Label htmlFor="name" className="text-left">
                            Nueva contraseña
                        </Label>
                        <Input
                            id="new-password"
                            type="password"
                            className="col-span-3"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="items-center gap-4">
                        <Label htmlFor="username">
                            Introduce de nuevo la contraseña
                        </Label>
                        <Input
                            id="new-password-retype"
                            className="col-span-3"
                            type="password"
                            onChange={(e) =>
                                setRetypeNewPassword(e.target.value)
                            }
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={() => {
                            handleSubmit()
                            }}
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
