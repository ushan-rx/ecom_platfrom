import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Expired(){
    return(
        <>
            <h1 className="mb-4 text-4xl">Downnload link expired</h1>
            <Button asChild size="lg">
                <Link href="/orders">Get New Link</Link>
            </Button>
        </>
    )
}