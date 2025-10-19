import { redirect } from 'next/navigation';

export default function OrangtuaPage() {
  // Redirect to dashboard as the main orangtua page
  redirect('/orangtua/dashboard');
  return null;
}