import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, topValues, selectedCategories, selectedCoachingPackage } = body;

    // Generate email content
    const valuesText = topValues
      .map((value: any, index: number) => `${index + 1}. ${value.name}: ${value.description}`)
      .join('\n');

    const emailContent = `
NEW CORE VALUES ASSESSMENT SUBMISSION
=====================================

CONTACT INFORMATION:
-------------------
Name: ${userProfile.name || 'Not provided'}
Email: ${userProfile.email}

COACHING INTEREST:
-----------------
${selectedCoachingPackage ? `Interested in: ${selectedCoachingPackage}` : 'No coaching package selected'}

ASSESSMENT RESULTS:
------------------
Selected Categories: ${selectedCategories.join(', ')}

Top 3 Core Values:
${valuesText}

---
This email was automatically generated from youdoyou.boo/core-values-assessment
`;

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Core Values Assessment <assessment@youdoyou.boo>',
        to: [process.env.NEXT_PUBLIC_COACH_EMAIL || 'cory@youdoyou.boo'],
        subject: `New Core Values Assessment${selectedCoachingPackage ? ` - Interested in ${selectedCoachingPackage}` : ''} - ${userProfile.name || 'Anonymous User'}`,
        text: emailContent,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return NextResponse.json({ success: false, error: data.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, submissionId: data.id });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
