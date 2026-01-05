import { Suspense } from "react";
import TimerLupaPasswordClient from "./TimerLupaPasswordClient";

export default function TimerLupaPasswordPage() {
  return (
    <Suspense fallback={null}>
      <TimerLupaPasswordClient />
    </Suspense>
  );
}
