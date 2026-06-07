import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt";

async function main() {
    const existing = await prisma.user.findFirst({
        where: { email: "admin" },
    })

    if (!existing) {
        await prisma.user.create({
            data: {
                name: "admin",
                email: "admin",
                password: await bcrypt.hash(process.env.ADMIN_PASSWORD!, process.env.PASSWORD_SALT!.replaceAll("\\$", "$")),
                subTeam: "Admin",
                status: "active",
            },
        })
        console.log("✅ Admin user created")
    } else {
        console.log("ℹ️ Admin user already exists, skipping")
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })