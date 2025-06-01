import React from 'react';
import { AuroraBackground } from '../components/ui/aurora-background';
import { motion } from 'framer-motion';
import { Bell, Shield, Globe, Clock } from 'lucide-react';

function Settings() {
  const settings = [
    {
      category: 'Notifications',
      icon: <Bell className="w-6 h-6" />,
      options: [
        {
          id: 'email-alerts',
          label: 'Email Alerts',
          description: 'Receive network status updates via email'
        },
        {
          id: 'push-notifications',
          label: 'Push Notifications',
          description: 'Get instant alerts on your device'
        }
      ]
    },
    {
      category: 'Security',
      icon: <Shield className="w-6 h-6" />,
      options: [
        {
          id: 'ssl-verification',
          label: 'SSL Verification',
          description: 'Verify SSL certificates during tests'
        },
        {
          id: 'firewall-checks',
          label: 'Firewall Checks',
          description: 'Include firewall status in diagnostics'
        }
      ]
    },
    {
      category: 'Monitoring',
      icon: <Globe className="w-6 h-6" />,
      options: [
        {
          id: 'auto-diagnostics',
          label: 'Automatic Diagnostics',
          description: 'Run tests periodically'
        },
        {
          id: 'performance-metrics',
          label: 'Performance Metrics',
          description: 'Track detailed network metrics'
        }
      ]
    }
  ];

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl px-4 py-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Settings
        </h1>

        <div className="grid gap-8">
          {settings.map((section) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="text-blue-500">{section.icon}</div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.category}
                </h2>
              </div>

              <div className="space-y-4">
                {section.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {option.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AuroraBackground>
  );
}

export default Settings;