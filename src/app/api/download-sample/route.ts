// app/api/download-sample/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Debug environment variables
console.log('=== DOWNLOAD SAMPLE UPSTASH DEBUG INFO ===');
console.log('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? 'EXISTS' : 'MISSING');
console.log('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? 'EXISTS' : 'MISSING');

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: NextRequest) {
  console.log('=== DOWNLOAD SAMPLE API CALLED ===');
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { phone, email } = body;

    // Validate required fields
    if (!phone || !email) {
      console.log('Validation failed - missing fields');
      return NextResponse.json(
        { message: 'Missing required fields: phone and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed - invalid email format');
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Create a unique download ID
    const downloadId = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated download ID:', downloadId);
    
    // Create download data object
    const downloadData = {
      id: downloadId,
      phone,
      email,
      createdAt: new Date().toISOString(),
      reportType: 'sample_report',
      status: 'completed',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    console.log('Download data to store:', downloadData);
    console.log('Redis config check - URL exists:', !!process.env.UPSTASH_REDIS_REST_URL);
    console.log('Redis config check - Token exists:', !!process.env.UPSTASH_REDIS_REST_TOKEN);

    // Store in Redis with timeout protection - non-blocking
    try {
      console.log('Attempting to store sample download in Redis...');
      await Promise.race([
        redis.hset(`samples_downloaded:${downloadId}`, downloadData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redis operation timed out')), 8000)
        )
      ]);
      console.log('Successfully stored sample download data');
    } catch (redisError) {
      console.error('Redis storage error:', redisError);
      // Continue anyway - download ID is generated and we can proceed
      console.log('Continuing despite Redis error - download ID is valid');
    }

    console.log('Sample download request processed successfully:', downloadId);

    // Return immediately without waiting for additional list/expiry operations
    return NextResponse.json({ 
      message: 'Download request processed successfully!',
      downloadId: downloadId,
      status: 'success'
    });

  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error storing sample download:', error);
    
    return NextResponse.json(
      { message: 'Failed to process download request. Please try again.' },
      { status: 500 }
    );
  }
}