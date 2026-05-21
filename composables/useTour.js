import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useTour = () => {
  const startTour = (tourId, steps, forceStart = false) => {
    // Check if the user has already seen this specific tour
    const hasSeenTour = localStorage.getItem(`hasSeenTour_${tourId}`);
    
    // If they have seen it and we aren't forcing it (via help button), do nothing
    if (hasSeenTour && !forceStart) {
      return;
    }

    const driverObj = driver({
      showProgress: true,
      nextBtnText: 'Lanjut ➔',
      prevBtnText: '⬅ Kembali',
      doneBtnText: 'Selesai ✓',
      steps: steps,
      onDestroyStarted: () => {
        if (!driverObj.hasNextStep() || confirm("Yakin ingin menutup panduan?")) {
          driverObj.destroy();
          // Mark as seen once closed
          localStorage.setItem(`hasSeenTour_${tourId}`, 'true');
        }
      }
    });
    
    driverObj.drive();
  };

  return { startTour };
};
