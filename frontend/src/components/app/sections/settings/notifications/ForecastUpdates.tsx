import { AnimatedCard } from "../../dashboard";
import ToggleRow from "./ToggleRow";

interface ForecastUpdatesProps {
  dailyEnabled: boolean;
  significantEnabled: boolean;
  onDailyChange: (value: boolean) => void;
  onSignificantChange: (value: boolean) => void;
  disabled?: boolean;
}

const ForecastUpdates = ({
  dailyEnabled,
  significantEnabled,
  onDailyChange,
  onSignificantChange,
  disabled,
}: ForecastUpdatesProps) => {
  return (
    <AnimatedCard delay={100}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Forecast Updates
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          When to notify you about forecast changes
        </p>

        <div className="mt-4 space-y-4">
          <ToggleRow
            label="Daily summary"
            description="Get a daily recap of your tracked markets"
            enabled={dailyEnabled}
            onChange={onDailyChange}
            disabled={disabled}
          />
          <ToggleRow
            label="Significant changes"
            description="Alert when forecasts change significantly"
            enabled={significantEnabled}
            onChange={onSignificantChange}
            disabled={disabled}
          />
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ForecastUpdates;
