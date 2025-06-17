'use client';
import { Suspense } from 'react';
import PaymentPage from './PaymentComponent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPage />
    </Suspense>
  );
}
