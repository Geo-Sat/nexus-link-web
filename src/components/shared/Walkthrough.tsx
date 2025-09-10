import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { useLocation } from 'react-router-dom';

interface Step {
  title: string;
  description: string;
  target: string;
}

const pageWalkthroughs: Record<string, Step[]> = {
  '/': [
    {
      title: 'Welcome to Dashboard',
      description: 'This is your main control center where you can monitor all your vehicles and activities.',
      target: '.dashboard-overview'
    }
  ],
  '/maps': [
    {
      title: 'Live Tracking',
      description: 'Track your vehicles in real-time on an interactive map.',
      target: '.map-container'
    },
    {
      title: 'Vehicle Selection',
      description: 'Select vehicles to track from the list on the right.',
      target: '.vehicle-list'
    }
  ],
  '/accounts': [
    {
      title: 'Account Management',
      description: 'Manage all your client accounts and their settings.',
      target: '.accounts-table'
    },
    {
      title: 'Add New Account',
      description: 'Click here to add a new client account.',
      target: '.add-account-button'
    }
  ]
};

export const Walkthrough = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem(`walkthrough-${location.pathname}`);
    if (!hasSeenWalkthrough && pageWalkthroughs[location.pathname]) {
      setSteps(pageWalkthroughs[location.pathname]);
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [location.pathname]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`walkthrough-${location.pathname}`, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const currentTarget = document.querySelector(steps[currentStep]?.target);
  const targetRect = currentTarget?.getBoundingClientRect();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />

          {/* Spotlight */}
          {targetRect && (
            <div
              className="fixed z-50 rounded-lg"
              style={{
                top: targetRect.top - 4,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 8,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
                pointerEvents: 'none'
              }}
            />
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm bg-card p-6 rounded-lg shadow-lg border"
          >
            <h3 className="text-lg font-semibold mb-2">
              {steps[currentStep]?.title}
            </h3>
            <p className="text-muted-foreground mb-4">
              {steps[currentStep]?.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="space-x-2">
                <Button variant="ghost" onClick={handleComplete}>
                  Skip
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
