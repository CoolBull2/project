import { AuroraBackground } from '../components/ui/aurora-background';
import { AiInsights } from '../components/AiInsights';
import { useDiagnosticStore } from '../store/diagnosticStore';

function NetworkAI() {
  const { anomalies } = useDiagnosticStore();

  return (
    <AuroraBackground>
      <div className="w-full max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ask Network AI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get AI-powered insights about your network performance
          </p>
        </div>

        <AiInsights anomalies={anomalies} />
      </div>
    </AuroraBackground>
  );
}

export default NetworkAI