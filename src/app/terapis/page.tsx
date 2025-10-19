import { redirect } from 'next/navigation';

export default function TerapisPage() {
  // Redirect to dashboard as the main terapis page
  redirect('/terapis/dashboard');
  return null;
}