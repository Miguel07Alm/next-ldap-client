import IHeader from "@/interfaces/IHeader";
import { Separator } from "../ui/separator";
export default function Header({username} : IHeader){
    return(
        <section className="tracking-tighter mt-32 h-full mb-8">
        <p className="text-4xl font-bold opacity-70">Hola, {username} 👋</p>
        </section>
    )
}