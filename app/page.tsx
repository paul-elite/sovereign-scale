'use client';

import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { CenterStage } from '@/components/layout/CenterStage';
import { RightSidebar } from '@/components/layout/RightSidebar';

export default function Home() {
  return (
    <div className="h-screen flex overflow-hidden bg-deep">
      {/* Left Sidebar - "The Gym" */}
      <LeftSidebar />

      {/* Center Stage - Preview */}
      <CenterStage />

      {/* Right Sidebar - "The Receipt" */}
      <RightSidebar />
    </div>
  );
}
