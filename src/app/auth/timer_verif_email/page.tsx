import { Suspense } from "react";
import TimerVerifEmailClient from "./TimerVerifEmailClient";

export default function TimerVerifEmailPage() {
  return (
    <Suspense fallback={null}>
      <TimerVerifEmailClient />
    </Suspense>
  );
}
