import React from 'react';
import { Button } from '@/components/ui/button';
import { UserProfile, CoreValue } from '@/types';
import {
  runHealthCheck,
  runEmailTest,
  dumpCurrentState,
  checkEnvironmentVariables,
  testZapierWebhook
} from '@/utils/debugUtils';

interface DebugTestButtonsProps {
  selectedCoachingPackage: string | undefined;
  topValues: CoreValue[];
  selectedCategories: string[];
  formData: UserProfile;
  isSubmitting: boolean;
}

export function DebugTestButtons({
  selectedCoachingPackage,
  topValues,
  selectedCategories,
  formData,
  isSubmitting
}: DebugTestButtonsProps) {
  return (
    <div className="space-y-2">
      <Button 
        type="button"
        onClick={runHealthCheck}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs"
        disabled={isSubmitting}
      >
        🏥 TEST 1: Check Backend Health
      </Button>
      
      <Button 
        type="button"
        onClick={() => runEmailTest(topValues, selectedCategories)}
        className="w-full bg-green-500 hover:bg-green-600 text-white text-xs"
        disabled={isSubmitting}
      >
        📧 TEST 2: Send Test Email with "Discovery Call"
      </Button>
      
      <Button 
        type="button"
        onClick={() => dumpCurrentState(selectedCoachingPackage, topValues, selectedCategories, formData)}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs"
      >
        🔍 TEST 3: Dump Current State
      </Button>
      
      <Button 
        type="button"
        onClick={checkEnvironmentVariables}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
        disabled={isSubmitting}
      >
        🐛 TEST 4: Check Environment Variables
      </Button>
      
      <Button 
        type="button"
        onClick={testZapierWebhook}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs"
        disabled={isSubmitting}
      >
        ⚡ TEST 5: Direct Zapier Webhook Test
      </Button>
    </div>
  );
}