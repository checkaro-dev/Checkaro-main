// app/api/booking/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Debug environment variables
console.log('=== UPSTASH DEBUG INFO ===');
console.log('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? 'EXISTS' : 'MISSING');
console.log('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? 'EXISTS' : 'MISSING');

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: NextRequest) {
  console.log('=== BOOKING API CALLED ===');
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { name, phone, email, address, propertyType, inspectionDate } = body;

    // --- CHANGE HERE: Updated validation logic ---
    // Only 'name' and 'phone' are required fields now.
    // The other fields can be empty strings.
    if (!name || !phone) {
      console.log('Validation failed - missing required fields: name or phone');
      return NextResponse.json(
        { message: 'Missing required fields: Full Name and Phone are required.' },
        { status: 400 }
      );
    }

    // Create a unique booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated booking ID:', bookingId);
    
    // Create booking data object, allowing optional fields to be empty
    const bookingData = {
      id: bookingId,
      name,
      phone,
      email: email || '', // Ensure it's a string
      address: address || '', // Ensure it's a string
      propertyType: propertyType || '', // Ensure it's a string
      inspectionDate: inspectionDate || '', // Ensure it's a string
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    console.log('Booking data to store:', bookingData);
    
    // Store in Upstash KV (Redis)
    console.log('Attempting to store in Redis...');
    await redis.hset(`booking:${bookingId}`, bookingData);
    console.log('Successfully stored booking data');

    // Also add to a list for easy retrieval of all bookings
    await redis.lpush('bookings:list', bookingId);
    console.log('Successfully added to bookings list');

    // Set expiration for the booking (optional - 30 days)
    await redis.expire(`booking:${bookingId}`, 30 * 24 * 60 * 60);
    console.log('Successfully set expiration');

    console.log('Booking stored successfully:', bookingId);

    return NextResponse.json({ 
      message: 'Booking submitted successfully!',
      bookingId: bookingId
    });

  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error storing booking:', error);
    
    return NextResponse.json(
      { message: 'Failed to submit booking. Please try again.' },
      { status: 500 }
    );
  }
}