import { useEffect, useState, useCallback } from 'react';
import { Medicine } from '@/lib/supabase';

interface ReminderState {
  isActive: boolean;
  nextMedicine: Medicine | null;
  medicines: Medicine[];
  notificationPermission: NotificationPermission | null;
  notificationsSent: Set<string>;
}

export function useReminder(medicines: Medicine[]) {
  const [reminder, setReminder] = useState<ReminderState>({
    isActive: true,
    nextMedicine: null,
    medicines,
    notificationPermission: null,
    notificationsSent: new Set(),
  });

  // Request notification permission on mount with better UX
  useEffect(() => {
    if ('Notification' in window) {
      // Check if permission is already granted
      const permission = Notification.permission;
      setReminder((prev) => ({ ...prev, notificationPermission: permission }));

      // Request permission if not determined
      if (permission === 'default') {
        Notification.requestPermission().then((permission) => {
          setReminder((prev) => ({ ...prev, notificationPermission: permission }));
          if (permission === 'granted') {
            console.log('✅ Browser notifications enabled');
          }
        });
      }
    }
    
    // Request service worker registration for better notification handling
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration optional for notifications
      });
    }
  }, []);

  // Update next medicine every minute
  useEffect(() => {
    const updateNextMedicine = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Find medicines due in the next 5 minutes
      const upcomingMedicines = medicines.filter((med) => {
        const medTime = med.time;
        const timeDiff = getTimeDifference(currentTime, medTime);
        return timeDiff >= 0 && timeDiff <= 5; // Due within next 5 minutes
      });

      setReminder((prev) => {
        if (upcomingMedicines.length > 0) {
          const nextMed = upcomingMedicines[0];
          
          // Send notification if permission is granted and not already sent
          if (
            'Notification' in window &&
            Notification.permission === 'granted' &&
            !prev.notificationsSent.has(nextMed.id)
          ) {
            sendNotification(nextMed);
            // Track that notification was sent for this medicine
            return {
              ...prev,
              nextMedicine: nextMed,
              notificationsSent: new Set([...prev.notificationsSent, nextMed.id]),
            };
          }
          
          return {
            ...prev,
            nextMedicine: nextMed,
          };
        } else {
          // Reset sent notifications when no medicine is due
          return {
            ...prev,
            nextMedicine: null,
            notificationsSent: new Set(),
          };
        }
      });
    };

    // Update immediately
    updateNextMedicine();

    // Update every minute (check more frequently for accuracy)
    const interval = setInterval(updateNextMedicine, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [medicines]);

  return reminder;
}

// Helper function to calculate time difference in minutes
function getTimeDifference(currentTime: string, medicineTime: string): number {
  const [currHours, currMinutes] = currentTime.split(':').map(Number);
  const [medHours, medMinutes] = medicineTime.split(':').map(Number);

  const currTotalMinutes = currHours * 60 + currMinutes;
  const medTotalMinutes = medHours * 60 + medMinutes;

  return medTotalMinutes - currTotalMinutes;
}

// Send browser notification with sound and persistence
function sendNotification(medicine: Medicine) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
      body: `Dosage: ${medicine.dosage}\nTime: ${medicine.time}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `medicine-reminder-${medicine.id}`,
      requireInteraction: true, // Keep notification until user interacts
      vibrate: [200, 100, 200], // Vibration pattern
    };
    const notification = new Notification(`💊 Medicine Time: ${medicine.name}`, notificationOptions);

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Play sound notification (optional - using Web Audio API)
    try {
      playNotificationSound();
    } catch (e) {
      console.log('Could not play notification sound');
    }
  }
}

// Play notification sound using Web Audio API
function playNotificationSound() {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Create beep sound
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// Function to manually trigger notification (for testing)
export function triggerTestNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('MediTrack+ Test Notification', {
      body: 'This is a test notification to verify browser notifications are working.',
      icon: '/favicon.ico',
    });
  } else {
    alert('Notifications are not enabled. Please enable them in your browser settings.');
  }
}
