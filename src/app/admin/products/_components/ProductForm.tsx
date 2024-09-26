
"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react"
import { addProduct } from "../../_actions/products";

export function ProductForm(){
    const [PriceInCents, setPriceInCents] = useState<number>();
    return (
        <form action={addProduct} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" name="name" required/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="priceInCents">Price In Cents</Label>
                <Input 
                    id="priceInCents" 
                    type="number" 
                    name="priceInCents" 
                    required
                    value={PriceInCents} 
                    onChange={e => setPriceInCents(Number(e.target.value) || undefined)} // to set the price in cents on change
                />
                {/* to display the price in dollars */}
                <div className="text-muted-foreground">  
                    {formatCurrency((PriceInCents || 0) / 100)} 
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" name="file" required/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" name="image" required/>
            </div>
            <Button type="submit">Save</Button>
        </form>
    )
}