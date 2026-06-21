import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, topValues, selectedCategories, selectedCoachingPackage } = body;

    // Run Systeme.io contact creation and Resend email notification in parallel
    const [contactResult, emailResult] = await Promise.allSettled([
      createSystemeContact(userProfile, topValues, selectedCategories, selectedCoachingPackage),
      sendNotificationEmail(userProfile, topValues, selectedCategories, selectedCoachingPackage),
    ]);

    if (contactResult.status === 'rejected') {
      console.error('Systeme.io contact creation failed:', contactResult.reason);
    }
    if (emailResult.status === 'rejected') {
      console.error('Resend email failed:', emailResult.reason);
    }

    // Return success as long as at least the email went through
    const emailOk = emailResult.status === 'fulfilled';
    return NextResponse.json({
      success: emailOk,
      submissionId: emailOk ? (emailResult.value as any).id : undefined,
      contact: contactResult.status === 'fulfilled' ? 'created' : 'failed',
    }, { status: emailOk ? 200 : 500 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ─── Systeme.io Contact Creation ──────────────────────────────────────────────
// Before deploying, create these custom field slugs in Systeme.io:
//   Contacts → Custom Fields → add each one as type "Text"
//   core_value_1 | core_value_1_category
//   core_value_2 | core_value_2_category
//   core_value_3 | core_value_3_category
//   coaching_package_interest
//   focus_categories

async function createSystemeContact(
  userProfile: any,
  topValues: any[],
  selectedCategories: string[],
  selectedCoachingPackage?: string
) {
  const apiKey = process.env.SYSTEME_API_KEY;
  if (!apiKey) throw new Error('SYSTEME_API_KEY not configured');

  const nameParts = (userProfile.name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Tags applied to the contact in Systeme.io
  const tags: { name: string }[] = [{ name: 'assessment-completed' }];
  if (selectedCoachingPackage) {
    const slug = selectedCoachingPackage
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    tags.push({ name: `interested-${slug}` });
  }

  // Custom fields — slugs must match what you created in Systeme.io dashboard
  const fields = [
    { slug: 'core_value_1',              value: topValues[0]?.name || '' },
    { slug: 'core_value_1_category',     value: topValues[0]?.category || '' },
    { slug: 'core_value_2',              value: topValues[1]?.name || '' },
    { slug: 'core_value_2_category',     value: topValues[1]?.category || '' },
    { slug: 'core_value_3',              value: topValues[2]?.name || '' },
    { slug: 'core_value_3_category',     value: topValues[2]?.category || '' },
    { slug: 'coaching_package_interest', value: selectedCoachingPackage || 'Not selected' },
    { slug: 'focus_categories',          value: selectedCategories.join(', ') },
  ];

  const payload = { email: userProfile.email, firstName, lastName, fields, tags };

  // Try to create the contact first
  const createResponse = await fetch('https://api.systeme.io/api/contacts', {
    method: 'POST',
    headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // 422 = contact already exists — find by email and update instead
  if (createResponse.status === 422) {
    const lookupResponse = await fetch(
      `https://api.systeme.io/api/contacts?email=${encodeURIComponent(userProfile.email)}`,
      { headers: { 'X-API-Key': apiKey } }
    );

    if (!lookupResponse.ok) {
      throw new Error(`Systeme.io lookup failed: ${lookupResponse.status}`);
    }

    const lookupData = await lookupResponse.json();
    const existingId = lookupData?.items?.[0]?.id;

    if (!existingId) {
      throw new Error('Systeme.io: contact exists but could not retrieve ID for update');
    }

    const updateResponse = await fetch(`https://api.systeme.io/api/contacts/${existingId}`, {
      method: 'PUT',
      headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, fields, tags }),
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      throw new Error(`Systeme.io update failed ${updateResponse.status}: ${error}`);
    }

    return updateResponse.json();
  }

  if (!createResponse.ok) {
    const error = await createResponse.text();
    throw new Error(`Systeme.io ${createResponse.status}: ${error}`);
  }

  return createResponse.json();
}

// ─── Resend Email Notification ────────────────────────────────────────────────

async function sendNotificationEmail(
  userProfile: any,
  topValues: any[],
  selectedCategories: string[],
  selectedCoachingPackage?: string
) {
  const valuesText = topValues
    .map((value: any, index: number) =>
      `${index + 1}. ${value.name} (${value.category}): ${value.description}`
    )
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
Contact has been added to Systeme.io with values as custom fields.
Tags applied: assessment-completed${selectedCoachingPackage ? `, interested-${selectedCoachingPackage.toLowerCase().replace(/\s+/g, '-')}` : ''}
`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Core Values Assessment <assessment@youdoyou.boo>',
      to: [process.env.NEXT_PUBLIC_COACH_EMAIL || 'cory@youdoyou.boo'],
      subject: `New Assessment: ${userProfile.name || 'Anonymous'}${selectedCoachingPackage ? ` — Interested in ${selectedCoachingPackage}` : ''} — Top Value: ${topValues[0]?.name || 'N/A'}`,
      text: emailContent,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${data.message}`);
  }

  return data;
}
