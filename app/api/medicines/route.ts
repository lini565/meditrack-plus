import { NextRequest, NextResponse } from 'next/server';
import { supabase, type Medicine } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dosage, time, quantity } = body;

    // Validate input
    if (!name || !dosage || !time || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert medicine into Supabase
    const { data, error } = await supabase
      .from('medicines')
      .insert([
        {
          name,
          dosage,
          time,
          quantity: parseInt(quantity),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to add medicine' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Medicine added successfully',
        data: data[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all medicines ordered by time
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('time', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch medicines' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Medicines fetched successfully',
        data: data as Medicine[],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, quantity } = body;

    if (!id || quantity === undefined) {
      return NextResponse.json(
        { error: 'ID and quantity are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('medicines')
      .update({ quantity: parseInt(quantity) })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update medicine' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Medicine stock updated', data: data[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Medicine ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete medicine' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Medicine deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
