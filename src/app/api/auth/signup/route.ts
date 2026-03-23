import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { signupSchema } from "@/lib/validations";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = signupSchema.parse(body);

    console.log('Checking if user exists:', validated.email);
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    console.log('Hashing password...');
    const passwordHash = await hash(validated.password, 12);

    console.log('Inserting user...');
    const [user] = await db
      .insert(users)
      .values({
        name: validated.name,
        email: validated.email,
        passwordHash,
      })
      .returning();

    console.log('User created:', user.id);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
