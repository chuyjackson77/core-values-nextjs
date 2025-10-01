// @ts-nocheck
import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { UserProfile, CoreValue } from '@/types';

export const runHealthCheck = async (): Promise<void> => {
  console.log('🏥 HEALTH CHECK: Testing backend connection...');
  
  try {
    const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-cbc66b9c/health`;
    console.log('Health URL:', healthUrl);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    console.log('Health Response Status:', response.status);
    console.log('Health Response Headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is healthy:', data);
      alert('✅ Backend connection SUCCESS!');
    } else {
      const errorText = await response.text();
      console.error('❌ Health check failed:', response.status, errorText);
      alert(`❌ Backend connection FAILED: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Health check error:', error);
  alert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const runEmailTest = async (
  topValues: CoreValue[], 
  selectedCategories: string[]
): Promise<void> => {
  console.log('📧 EMAIL TEST: Testing email submission...');
  
  const testCoachingPackage = "Discovery Call";
  
  const requestBody = {
    userProfile: {
      name: 'TEST USER - DEBUG',
      email: 'debug@test.com'
    },
    topValues: topValues.length > 0 ? topValues : [
      { name: 'Growth', description: 'Test value', category: 'Personal Growth' },
      { name: 'Excellence', description: 'Test value', category: 'Work & Career' },
      { name: 'Authenticity', description: 'Test value', category: 'Values & Ethics' }
    ],
    selectedCategories: selectedCategories.length > 0 ? selectedCategories : ['Personal Growth', 'Work & Career'],
    selectedCoachingPackage: testCoachingPackage,
  };
  
  console.log('📨 Full test payload:', JSON.stringify(requestBody, null, 2));
  
  try {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-cbc66b9c/submit-assessment`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('📧 Email test response status:', response.status);
    console.log('📧 Email test response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Email test SUCCESS:', result);
      alert('✅ Email test SUCCESS! Check your email.');
    } else {
      const errorText = await response.text();
      console.error('❌ Email test failed:', response.status, errorText);
      alert(`❌ Email test FAILED: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Email test error:', error);
    alert(`❌ Email test error: ${error.message}`);
  }
};

export const dumpCurrentState = (
  selectedCoachingPackage: string | undefined,
  topValues: CoreValue[],
  selectedCategories: string[],
  formData: UserProfile
): void => {
  console.log('🔍 CURRENT STATE DUMP:');
  console.log('Selected Coaching Package:', selectedCoachingPackage);
  console.log('Top Values:', topValues);
  console.log('Selected Categories:', selectedCategories);
  console.log('Form Data:', formData);
  console.log('Project ID:', projectId);
  console.log('Anon Key (first 20):', publicAnonKey.substring(0, 20) + '...');
  
  alert(`Debug Info:
Selected Package: ${selectedCoachingPackage || 'NONE'}
Top Values: ${topValues.length}
Categories: ${selectedCategories.length}
Project ID: ${projectId}`);
};

export const checkEnvironmentVariables = async (): Promise<void> => {
  console.log('🐛 ENV CHECK: Testing environment variables...');
  
  try {
    const debugUrl = `https://${projectId}.supabase.co/functions/v1/make-server-cbc66b9c/debug-env`;
    console.log('Debug URL:', debugUrl);
    
    const response = await fetch(debugUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('🐛 Environment Variables:', data);
      
      const envStatus = Object.entries(data.environment)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      
      alert(`Environment Variables:\n${envStatus}`);
    } else {
      const errorText = await response.text();
      console.error('❌ Env check failed:', response.status, errorText);
      alert(`❌ Environment check FAILED: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Env check error:', error);
    alert(`❌ Environment check error: ${error.message}`);
  }
};

export const testZapierWebhook = async (): Promise<void> => {
  console.log('⚡ WEBHOOK TEST: Testing Zapier webhook directly...');
  
  try {
    const webhookTestUrl = `https://${projectId}.supabase.co/functions/v1/make-server-cbc66b9c/test-webhook`;
    console.log('Webhook test URL:', webhookTestUrl);
    
    const response = await fetch(webhookTestUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('⚡ Webhook test response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Webhook test SUCCESS:', data);
      alert('✅ Zapier webhook test SUCCESS! Check your email at cory@youdoyou.boo');
    } else {
      const errorData = await response.json();
      console.error('❌ Webhook test failed:', errorData);
      alert(`❌ Webhook test FAILED: ${errorData.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('❌ Webhook test error:', error);
    alert(`❌ Webhook test error: ${error.message}`);
  }
};
