'use client';


import { deleteCookies } from "@/app/actions";
import { Button } from "../ui/button"

export default  function Navbar() {
    return (
        <nav
            className={`flex tracking-tight justify-between items-center font-bold fixed top-0 left-0 w-full z-10 shadow-md bg-white h-18`}
        >
            <div className="text-2xl md:text-2xl flex container justify-between mx-auto my-5 items-center self-cente">
                <a className="cursor-pointer">Cliente para LDAP 🚀</a>
                <div className="flex items-center align-middle">
                    <Button onClick={() => {
                        deleteCookies();
                        window.location.reload();
                    }}>Cerrar sesión</Button>
                </div>
            </div>
        </nav>
    );
}