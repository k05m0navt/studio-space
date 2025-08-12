import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const GET = requireRole(['ADMIN'])(async () => {
  try {
    const dbUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    const users = dbUsers.map(u => ({
      id: u.id,
      name: u.name ?? '',
      email: u.email,
      role: String(u.role).toLowerCase(),
      isActive: true,
      lastLogin: null,
      createdAt: u.createdAt
    }));

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

export const POST = requireRole(['ADMIN'])(async ({ request }) => {
  try {
    const userData = await request.json();

    const user = await prisma.user.create({
      data: userData,
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    const responseUser = {
      id: user.id,
      name: user.name ?? '',
      email: user.email,
      role: String(user.role).toLowerCase(),
      isActive: true,
      lastLogin: null,
      createdAt: user.createdAt
    };

    return new Response(JSON.stringify({ user: responseUser }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create user" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}); 