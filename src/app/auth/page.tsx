import { redirect } from 'next/navigation';

export default function AuthPage() {
  // Redirect to login as the main auth page
  redirect('/auth/login');
  return null;
}