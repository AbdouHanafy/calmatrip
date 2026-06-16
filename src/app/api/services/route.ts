import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const maxOrder = await prisma.service.aggregate({ _max: { order: true } });

    const service = await prisma.service.create({
      data: {
        title: json.title,
        subtitle: json.subtitle ?? null,
        description: json.description,
        price: json.price.toString(),
        category: json.category,
        duration: json.duration ?? null,
        icon: json.icon ?? 'Car',
        color: json.color ?? null,
        image: json.image ?? null,
        active: json.active ?? true,
        popular: json.popular ?? false,
        order: (maxOrder._max.order ?? 0) + 1,
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
