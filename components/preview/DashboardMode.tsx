'use client';

// Dense UI Preview - "Dashboard" Mode
import { FluidText } from '@/components/ui/FluidText';
import { useScaleStore } from '@/store/useScaleStore';

export function DashboardMode() {
  const scaleSteps = useScaleStore((s) => s.scaleSteps);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <FluidText step={3} className="font-bold text-primary">
            Dashboard
          </FluidText>
          <FluidText step={-1} className="text-secondary">
            Dense UI typography preview
          </FluidText>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-accent text-white rounded-lg">
            <FluidText step={-1}>New Report</FluidText>
          </button>
          <button className="px-4 py-2 bg-surface text-primary rounded-lg">
            <FluidText step={-1}>Settings</FluidText>
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Users" value="12,847" change="+12.5%" positive />
        <StatCard label="Revenue" value="$89,432" change="+8.2%" positive />
        <StatCard label="Bounce Rate" value="24.3%" change="-3.1%" positive />
        <StatCard label="Avg. Session" value="4m 32s" change="-0.8%" positive={false} />
      </div>

      {/* Table preview */}
      <div className="bg-surface rounded-lg overflow-hidden">
        <div className="p-4 border-b border-subtle">
          <FluidText step={1} className="font-semibold text-primary">
            Recent Activity
          </FluidText>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-subtle">
              <th className="text-left p-4">
                <FluidText step={-1} className="text-secondary font-medium">
                  User
                </FluidText>
              </th>
              <th className="text-left p-4">
                <FluidText step={-1} className="text-secondary font-medium">
                  Action
                </FluidText>
              </th>
              <th className="text-left p-4">
                <FluidText step={-1} className="text-secondary font-medium">
                  Status
                </FluidText>
              </th>
              <th className="text-right p-4">
                <FluidText step={-1} className="text-secondary font-medium">
                  Time
                </FluidText>
              </th>
            </tr>
          </thead>
          <tbody>
            <TableRow
              user="Sarah Chen"
              action="Created new project"
              status="success"
              time="2m ago"
            />
            <TableRow
              user="Marcus Webb"
              action="Updated billing info"
              status="success"
              time="15m ago"
            />
            <TableRow
              user="Elena Rodriguez"
              action="Failed payment"
              status="error"
              time="1h ago"
            />
            <TableRow
              user="James Nguyen"
              action="Exported report"
              status="pending"
              time="2h ago"
            />
          </tbody>
        </table>
      </div>

      {/* Scale reference */}
      <div className="bg-surface rounded-lg p-4">
        <FluidText step={1} className="font-semibold text-primary mb-4">
          Scale Reference
        </FluidText>
        <div className="space-y-2">
          {scaleSteps.map((step) => (
            <div
              key={step.step}
              className="flex items-center justify-between py-2 border-b border-subtle last:border-0"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 text-center font-mono text-xs text-secondary">
                  {step.step}
                </span>
                <FluidText step={step.step} className="text-primary">
                  {step.name}
                </FluidText>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-secondary">
                <span>{step.minSize.toFixed(1)}px</span>
                <span className="text-accent">{step.currentSize.toFixed(1)}px</span>
                <span>{step.maxSize.toFixed(1)}px</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar simulation */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-surface rounded-lg p-4 space-y-4">
          <FluidText step={1} className="font-semibold text-primary">
            Chart Area
          </FluidText>
          <div className="aspect-[2/1] bg-deep rounded flex items-center justify-center">
            <FluidText step={0} className="text-secondary/30">
              [Chart Placeholder]
            </FluidText>
          </div>
          <FluidText step={-1} className="text-secondary">
            Monthly revenue trend showing 23% growth over the previous quarter.
          </FluidText>
        </div>

        <div className="bg-surface rounded-lg p-4 space-y-3">
          <FluidText step={0} className="font-semibold text-primary">
            Quick Actions
          </FluidText>
          <ActionItem label="Generate Report" />
          <ActionItem label="Send Invoice" />
          <ActionItem label="Schedule Meeting" />
          <ActionItem label="Export Data" />
          <FluidText step={-2} className="text-secondary/50 pt-2">
            Last updated 5 minutes ago
          </FluidText>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="bg-surface rounded-lg p-4">
      <FluidText step={-1} className="text-secondary">
        {label}
      </FluidText>
      <FluidText step={2} className="font-bold text-primary mt-1">
        {value}
      </FluidText>
      <FluidText
        step={-2}
        className={positive ? 'text-green-400' : 'text-red-400'}
      >
        {change}
      </FluidText>
    </div>
  );
}

function TableRow({
  user,
  action,
  status,
  time,
}: {
  user: string;
  action: string;
  status: 'success' | 'error' | 'pending';
  time: string;
}) {
  const statusColors = {
    success: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <tr className="border-b border-subtle last:border-0">
      <td className="p-4">
        <FluidText step={0} className="text-primary">
          {user}
        </FluidText>
      </td>
      <td className="p-4">
        <FluidText step={-1} className="text-secondary">
          {action}
        </FluidText>
      </td>
      <td className="p-4">
        <span className={`px-2 py-1 rounded text-xs ${statusColors[status]}`}>
          {status}
        </span>
      </td>
      <td className="p-4 text-right">
        <FluidText step={-2} className="text-secondary/60">
          {time}
        </FluidText>
      </td>
    </tr>
  );
}

function ActionItem({ label }: { label: string }) {
  return (
    <button className="w-full text-left px-3 py-2 bg-deep rounded hover:bg-elevated transition-colors">
      <FluidText step={-1} className="text-primary">
        {label}
      </FluidText>
    </button>
  );
}
