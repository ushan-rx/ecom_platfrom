"use server"

import db from "@/db/db"
import { z } from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const fileSchema = z.instanceof(File, {message: "Required"})  // to check if the type of the file is a file
const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"))  // to check if the file is an image

const addSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(0),
    file: fileSchema.refine(file => file.size > 0,  "Required"),
    image: imageSchema.refine(file => file.size > 0, "required")
})

const editSchema = addSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional()
})

export async function addProduct(prevState: unknown, formData: FormData){
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));  // to parse the form data into an object
    if(result.success === false){  // if the form data are not valid
        return result.error.formErrors.fieldErrors   // to return the errors from each field in the form
    }
    const data = result.data;

    await fs.mkdir("products", {recursive: true})  // to create a directory for the products  
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    await fs.mkdir("public/products", {recursive: true})  // to create a directory for the products  
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`public${imagePath}`, 
        Buffer.from(await data.image.arrayBuffer()))  //get the file and convert into node buffer to write in a file

    await db.product.create({ data:{
        isAvailableForPurchase: false,
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath
    }})

    revalidatePath("/")
    revalidatePath("/products")  // to revalidate the cache for the products page
    redirect('/admin/products')
}

export async function  toggleProductAvailability(
    id: string,
    isAvailableForPurchase: boolean
){
    await db.product.update({
        where: {id},
        data: {isAvailableForPurchase}
    })

    revalidatePath("/")
    revalidatePath("/products")
}

export async function deleteProduct(id: string){
    const product = await db.product.delete({where: {id}});
    if(product == null) return notFound();

    await fs.unlink(product.filePath);
    await fs.unlink(`public${product.imagePath}`);

    revalidatePath("/")
    revalidatePath("/products")
}

export async function updateProduct(id: string, prevState: unknown, formData: FormData){
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()));  // to parse the form data into an object
    if(result.success === false){  // if the form data are not valid
        return result.error.formErrors.fieldErrors   // to return the errors from each field in the form
    }
    const data = result.data;
    const product = await db.product.findUnique({where: {id}});
    if(product == null) return notFound();

    let filePath = product.filePath;
    if(data.file != null && data.file.size > 0){
        await fs.unlink(product.filePath);
        filePath = `products/${crypto.randomUUID()}-${data.file.name}`
        await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
    } 
    
    let imagePath = product.imagePath;
    if(data.image != null && data.image.size > 0){
        await fs.unlink(`public${product.imagePath}`);
        imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
        await fs.writeFile(`public${imagePath}`, 
            Buffer.from(await data.image.arrayBuffer()))  //get the file and convert into node buffer to write in a file
    }

    await db.product.update({ 
        where: {id},
        data:{
            name: data.name,
            description: data.description,
            priceInCents: data.priceInCents,
            filePath,
            imagePath
    }})

    revalidatePath("/")
    revalidatePath("/products")
    redirect('/admin/products')
}