import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  try {
    const body = await req.json();

    const user =
      await prisma.user.update({
        where: {
          id: params.id,
        },
        data: {
          status: body.status
        },
      });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      {
        status: 500,
      }
    );
  }
}