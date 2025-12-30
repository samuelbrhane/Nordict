import { AnimatedCard } from "../../dashboard";
import ToggleRow from "./ToggleRow";

interface AlertChannelsProps {
  emailEnabled: boolean;
  pushEnabled: boolean;
  onEmailChange: (value: boolean) => void;
  onPushChange: (value: boolean) => void;
  disabled?: boolean;
}

const AlertChannels = ({
  emailEnabled,
  pushEnabled,
  onEmailChange,
  onPushChange,
  disabled,
}: AlertChannelsProps) => {
  return (
    <AnimatedCard delay={50}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Alert Channels
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          How you want to receive price alerts
        </p>

        <div className="mt-4 space-y-4">
          <ToggleRow
            label="Email notifications"
            description="Receive alerts via email"
            enabled={emailEnabled}
            onChange={onEmailChange}
            disabled={disabled}
          />
          <ToggleRow
            label="Push notifications"
            description="Receive alerts on your device"
            enabled={pushEnabled}
            onChange={onPushChange}
            disabled={disabled}
            badge="Coming soon"
          />
        </div>
      </div>
    </AnimatedCard>
  );
};

export default AlertChannels;
